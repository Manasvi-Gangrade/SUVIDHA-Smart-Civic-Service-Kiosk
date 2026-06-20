# Smart City Civic Services Kiosk - Backend API

## Overview
This backend API provides authentication and user management services for the Smart City Civic Services Kiosk application using **MongoDB** for data storage.

## Features
- **Multi-method Authentication**: Support for Aadhaar, Mobile, and Account ID based login
- **OTP-based Verification**: Secure 6-digit OTP system with rate limiting
- **JWT Session Management**: Secure token-based authentication
- **Audit Logging**: Complete activity tracking for security
- **Rate Limiting**: Protection against brute force attacks
- **MongoDB Integration**: NoSQL database with flexible schema design

## Tech Stack
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-rate-limit** for API protection

## Installation

### Prerequisites
- Node.js 16+
- MongoDB 4.4+ (local installation)
- npm or yarn

### Setup Steps

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB connection string and JWT secrets
   ```

3. **Start MongoDB locally**
   ```bash
   # On Windows
   mongod
   
   # On macOS/Linux
   sudo systemctl start mongod
   # or
   mongod
   ```

4. **Initialize database with sample data**
   ```bash
   node database/init-data.js
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication

#### Send OTP
```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "method": "aadhaar|mobile|account",
  "value": "123456789012"
}
```

#### Verify OTP & Login
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "method": "aadhaar|mobile|account",
  "value": "123456789012",
  "otp": "123456"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <jwt_token>
```

### Health Check
```http
GET /api/health
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## Security Features

### Rate Limiting
- **OTP Requests**: 5 requests per 15 minutes per IP
- **Login Attempts**: 10 attempts per 15 minutes per IP

### Session Management
- JWT tokens with 24-hour expiry
- Session tracking in MongoDB
- Automatic session invalidation on logout

### Data Protection
- Password hashing with bcryptjs
- Input validation and sanitization
- Sensitive data masking in responses
- CORS configuration for cross-origin requests

### Audit Logging
- All authentication attempts logged
- IP address and user agent tracking
- Success/failure status recording

### Email OTP Setup (Gmail App Password)
To send real OTP emails from the backend, configure Gmail SMTP in `backend/.env`:

```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

- `EMAIL_PASS` must be your 16-character Google App Password generated from your Google account security settings.
- Spaces are allowed when you paste it; backend strips spaces automatically.
- Use app password only (do not use your normal Gmail account password).

## Database Schema (MongoDB)

### Citizens Collection
```javascript
{
  id: "CIT-2026-001",
  fullName: "Rajesh Kumar",
  aadhaar: "123456789012",
  mobile: "9876543210",
  email: "rajesh.kumar@email.com",
  accountId: "ACC-MH-2026-7890",
  isActive: true,
  createdAt: ISODate,
  updatedAt: ISODate
}
```

### OTP Sessions Collection
```javascript
{
  identifier: "123456789012",
  identifierType: "aadhaar",
  otpCode: "123456",
  isUsed: false,
  expiresAt: ISODate,
  attempts: 0,
  createdAt: ISODate
}
```

### User Sessions Collection
```javascript
{
  citizenId: "CIT-2026-001",
  tokenHash: "sha256_hash",
  deviceInfo: "Mozilla/5.0...",
  ipAddress: "192.168.1.1",
  isActive: true,
  expiresAt: ISODate,
  lastAccessed: ISODate
}
```

### Audit Logs Collection
```javascript
{
  citizenId: "CIT-2026-001",
  action: "login",
  identifierType: "aadhaar",
  identifierValue: "123456789012",
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  status: "success",
  errorMessage: null,
  createdAt: ISODate
}
```

## Development Notes

### OTP Testing
In development mode, OTP is returned in the response for testing:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "otp": "123456" // Only in development
}
```

### Sample Users
Pre-configured test users are available:
- **Rajesh Kumar**: Aadhaar 123456789012, Mobile 9876543210
- **Priya Sharma**: Aadhaar 234567890123, Mobile 8765432109
- **Amit Patel**: Aadhaar 345678901234, Mobile 7654321098
- **Sunita Reddy**: Aadhaar 456789012345, Mobile 6543210987
- **Mohammed Ali**: Aadhaar 567890123456, Mobile 5432109876

### MongoDB Features
- **TTL Indexes**: Automatic cleanup of expired OTPs and sessions
- **Compound Indexes**: Optimized queries for authentication
- **Virtual Fields**: Masked sensitive data (Aadhaar, mobile)
- **Validation**: Built-in data validation at schema level

## Production Deployment

### Recommended Baseline (Scalable + Secure)
1. Run backend and dependencies in containers using `docker-compose.prod.yml` from the project root.
2. Keep MongoDB, Redis, Kafka on an internal Docker network and expose only backend port 5000.
3. Use `/api/health` for observability and `/api/ready` for load balancer readiness checks.
4. Run backend as non-root in container (already configured in `backend/Dockerfile`).
5. Store secrets in environment variables (never commit real credentials into `.env.example`).

### Start Production Stack
From project root:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### Scale Backend Horizontally
From project root:

```bash
docker compose -f docker-compose.prod.yml up -d --scale backend=3
```

In real production, place an API gateway/load balancer in front of backend replicas.

### 3-4 Device Scalability (Practical Check)
If your target is serving 3-4 devices at the same time, use this workflow:

1. Start the full stack with replicas:
  ```bash
  docker compose -f docker-compose.prod.yml up -d --build --scale backend=4
  ```
2. Keep traffic through gateway only (`http://localhost:5000`).
3. Open the app/API from 3-4 phones/laptops simultaneously.
4. Run synthetic load in parallel from backend folder:
  ```bash
  npm run loadtest:4
  ```
5. Confirm these signals:
  - `2xx` responses near 100%
  - low error rate (`4xx/5xx` close to 0 for valid requests)
  - stable p95 latency during test window
  - `docker stats` shows load spread across multiple backend containers

If these conditions hold during repeated test runs, the system is functionally scalable for your 3-4 concurrent-device goal.

### Verify Runtime Health
```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/ready
```

### Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-host:27017/smartcity_kiosk
JWT_SECRET=your_long_secure_jwt_secret
JWT_EXPIRE=24h
OTP_SECRET=your_otp_secret
```

### MongoDB Setup
```bash
# Create database
mongo
use smartcity_kiosk

# Create user
db.createUser({
  user: "kiosk_user",
  pwd: "secure_password",
  roles: [{ role: "readWrite", db: "smartcity_kiosk" }]
})
```

### Security Considerations
- Use strong, unique JWT secrets
- Enable HTTPS in production
- Configure MongoDB authentication
- Enable MongoDB security features
- Regular security updates
- Monitor audit logs for suspicious activity

## API Documentation

### Authentication Flow
1. Client sends OTP request with authentication method and identifier
2. Server generates OTP and stores with expiry
3. Client receives OTP (via SMS in production, API response in development)
4. Client verifies OTP with identifier and OTP code
5. Server validates OTP and returns JWT token
6. Client includes JWT token in subsequent requests

### Error Codes
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (invalid/expired token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (user not found)
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error

## MongoDB vs MySQL Benefits

### Advantages of MongoDB
- **Flexible Schema**: Easy to add new fields without migration
- **Document Structure**: Nested data representation
- **TTL Indexes**: Automatic data expiration
- **Scalability**: Horizontal scaling support
- **Development Speed**: No schema migrations required
- **JSON-like Data**: Direct mapping to JavaScript objects

### Performance Features
- **Automatic Indexing**: Optimized query performance
- **In-memory Operations**: Fast OTP and session management
- **Connection Pooling**: Efficient database connections
- **Caching**: Built-in MongoDB caching

## Support

For technical support or questions:
- Check the application logs
- Review audit logs for authentication issues
- Verify MongoDB connection and data
- Ensure environment variables are correctly configured
- Check MongoDB service status
