const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  sendOTP,
  verifyOTP,
  logout,
  getCurrentUser,
  signup,
  login,
  initiateSupportCall,
} = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Rate limiting for OTP requests
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 OTP requests per windowMs
  message: {
    success: false,
    message: "Too many OTP requests, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login attempts per windowMs
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Sign up new citizen
router.post("/signup", signup);

// Login without OTP
router.post("/login", loginLimiter, login);

// Send OTP (backward compatibility, not required for simple credential login)
router.post("/send-otp", otpLimiter, sendOTP);

// Verify OTP and login (backward compatibility)
router.post("/verify-otp", loginLimiter, verifyOTP);

// Logout user
router.post("/logout", authenticateToken, logout);

// Get current user info
router.get("/me", authenticateToken, getCurrentUser);

// Initiate Support Call (alerts officers via voice and SMS)
router.post("/initiate-support-call", initiateSupportCall);

module.exports = router;
