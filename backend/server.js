const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const connectDB = require("./config/database");
const { getMongoStatus } = require("./config/database");
const authRoutes = require("./routes/auth");
const civicRoutes = require("./routes/civic");
const sandboxRoutes = require("./routes/sandbox");

// Infrastructure clients for Kafka & Redis
const { connectRedis, getRedisStatus } = require("./config/redis");
const { connectProducer, getKafkaStatus } = require("./config/kafka");

const app = express();
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Connect Infrastructure
connectDB();
// Start infrastructure connections in background (non-blocking)
const redisBoot = connectRedis().catch(err => console.warn("🔶 Redis unavailable (non-critical):", err.message));
const kafkaBoot = connectProducer().catch(err => console.warn("🔶 Kafka unavailable (non-critical):", err.message));

// Security middleware
app.use(helmet());

// mTLS / Device Trust Middleware (Device-first trust endpoint validation)
app.use((req, res, next) => {
  // Configured to enforce mTLS in production or via API gateway headers
  if (process.env.ENFORCE_MTLS === "true") {
      // Check NGINX header OR socket peer cert
      const clientCert = req.headers['x-client-cert'] || (req.socket.getPeerCertificate ? req.socket.getPeerCertificate() : null);
      if (!clientCert || (req.client && req.client.authorized === false)) {
          console.warn(`[mTLS] Rejected unauthorized device connection from ${req.ip}`);
          return res.status(403).json({ 
              success: false, 
              message: "Device Certificate missing or invalid. Edge-first trust required."
          });
      }
  }
  next();
});

const allowedOriginsStr = process.env.FRONTEND_URL || "*";
const allowedOrigins = allowedOriginsStr.split(",").map(s => s.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin || 
        allowedOriginsStr === "*" || 
        allowedOrigins.includes(origin) || 
        (process.env.NODE_ENV === "development" && origin.startsWith("http://localhost:"))
      ) {
        callback(null, true);
      } else {
        // By default for this hackathon, we'll allow unknown origins but log a warning
        // to prevent 500 Internal Server Errors on OPTIONS requests.
        console.warn(`[CORS Warning] Origin ${origin} is not in FRONTEND_URL. Allowing for demo purposes.`);
        callback(null, true);
      }
    },
    credentials: true,
  }),
);

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`,
  );
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/civic", civicRoutes);
app.use("/api/sandbox", sandboxRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  const mongo = getMongoStatus();
  const redis = getRedisStatus();
  const kafka = getKafkaStatus();

  res.json({
    success: true,
    message: "Smart City Kiosk API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    services: {
      mongo,
      redis,
      kafka,
    },
  });
});

app.get("/api/status", (req, res) => {
  res.json({
    redis: getRedisStatus(),
    kafka: getKafkaStatus(),
    mongo: getMongoStatus(),
  });
});

// Readiness endpoint for container orchestration and load balancers
app.get("/api/ready", (req, res) => {
  const mongo = getMongoStatus();
  const isReady = mongo.status === "connected";

  if (!isReady) {
    return res.status(503).json({
      success: false,
      message: "Service is not ready",
      services: {
        mongo,
        redis: getRedisStatus(),
        kafka: getKafkaStatus(),
      },
    });
  }

  return res.json({
    success: true,
    message: "Service is ready",
    services: {
      mongo,
      redis: getRedisStatus(),
      kafka: getKafkaStatus(),
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error:", error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Smart City Kiosk API running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📡 Infra status: http://localhost:${PORT}/api/status`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
  console.log(`🏛️  Civic endpoints: http://localhost:${PORT}/api/civic`);
  console.log(`🗄️  Database: MongoDB\n📦 Caching: Redis\n📨 Queue: Kafka`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🛡️  mTLS Enforced: ${process.env.ENFORCE_MTLS === 'true' ? 'Yes' : 'No'}`);
});

Promise.allSettled([redisBoot, kafkaBoot]).then(() => {
  const redis = getRedisStatus();
  const kafka = getKafkaStatus();

  console.log(
    `📡 Infrastructure status => Redis (enabled: ${redis.enabled}, connected: ${redis.connected}, status: ${redis.status}), Kafka (enabled: ${kafka.enabled}, connected: ${kafka.connected}, status: ${kafka.status})`
  );
});

const shutdownSignals = ["SIGINT", "SIGTERM"];

shutdownSignals.forEach((signal) => {
  process.on(signal, () => {
    console.log(`Received ${signal}. Shutting down API server gracefully...`);
    server.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
  });
});
