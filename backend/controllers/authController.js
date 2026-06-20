const crypto = require("crypto");
const Citizen = require("../models/Citizen");
const OtpSession = require("../models/OtpSession");
const UserSession = require("../models/UserSession");
const AuditLog = require("../models/AuditLog");
const { generateToken } = require("../middleware/auth");
const otpService = require("../utils/otpService");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const normalizeIdentifier = (method, value) => {
  if (method === "email") {
    return String(value || "").trim().toLowerCase();
  }
  return String(value || "").trim();
};

const validateIdentifier = (method, value) => {
  if (method === "aadhaar" && !/^\d{12}$/.test(value)) return "Aadhaar must be 12 digits";
  if (method === "mobile" && !/^[6-9]\d{9}$/.test(value)) return "Mobile must be 10 digits starting with 6-9";
  if (method === "account" && value.length < 5) return "Account ID must be at least 5 characters";
  if (method === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email must be a valid address";
  return null;
};

const signup = async (req, res) => {
  const { fullName, aadhaar, mobile, accountId, email } = req.body;

  if (!fullName || !aadhaar || !mobile || !accountId) {
    return res.status(400).json({
      success: false,
      message: "Full name, Aadhaar, mobile, and account ID are required",
    });
  }

  if (!/^\d{12}$/.test(aadhaar)) {
    return res.status(400).json({ success: false, message: "Aadhaar must be 12 digits" });
  }

  if (!/^[6-9]\d{9}$/.test(mobile)) {
    return res.status(400).json({ success: false, message: "Mobile must be 10 digits starting with 6-9" });
  }

  if (!/^[A-Za-z0-9\-]{5,30}$/.test(accountId)) {
    return res.status(400).json({ success: false, message: "Account ID invalid format" });
  }

  const normalizedEmail = email ? String(email).trim().toLowerCase() : undefined;

  try {
    const existing = await Citizen.findOne({
      $or: [{ aadhaar }, { mobile }, { accountId }, ...(normalizedEmail ? [{ email: normalizedEmail }] : [])],
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "A user with same Aadhaar, mobile, Account ID, or email already exists",
      });
    }

    const citizen = await Citizen.create({
      id: `CIT-${Date.now()}`,
      fullName,
      aadhaar,
      mobile,
      accountId,
      email: normalizedEmail,
    });

    return res.status(201).json({
      success: true,
      message: "Citizen registered successfully",
      citizen: {
        id: citizen.id,
        fullName: citizen.fullName,
        aadhaar: citizen.maskedAadhaar,
        mobile: citizen.maskedMobile,
        accountId: citizen.accountId,
        email: citizen.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {}).join(", ");
      return res.status(409).json({ success: false, message: `Duplicate value for ${field}` });
    }
    return res.status(500).json({ success: false, message: "Failed to register citizen" });
  }
};

const sendOTP = async (req, res) => {
  const { method, value } = req.body;

  if (!method || !value) {
    return res.status(400).json({ success: false, message: "Authentication method and value are required" });
  }

  const validMethods = ["aadhaar", "mobile", "account", "email"];
  if (!validMethods.includes(method)) {
    return res.status(400).json({ success: false, message: "Invalid authentication method" });
  }

  const normalizedValue = normalizeIdentifier(method, value);
  const validationError = validateIdentifier(method, normalizedValue);
  if (validationError) {
    return res.status(400).json({ success: false, message: validationError });
  }

  try {
    const citizen = await Citizen.findByIdentifier(method, normalizedValue);

    if (!citizen && method !== "mobile") {
      await AuditLog.logActivity({
        action: "otp_send",
        identifierType: method,
        identifierValue: normalizedValue,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        status: "failure",
        errorMessage: "User not found",
      });
      return res.status(404).json({ success: false, message: "User not found with provided credentials" });
    }
    await AuditLog.logActivity({
      ...(citizen ? { citizenId: citizen.id } : {}),
      action: "otp_send",
      identifierType: method,
      identifierValue: normalizedValue,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
      status: "success",
    });

    if (method === "mobile") {
      const dispatchResult = await otpService.sendMobileOTP(normalizedValue);
      if (!dispatchResult.success) {
        return res.status(500).json({ success: false, message: dispatchResult.message || "Failed to send SMS OTP" });
      }
      return res.json({
        success: true,
        message: "OTP sent successfully via SMS",
      });
    }

    const otp = generateOTP();

    await OtpSession.createOTP(normalizedValue, method, otp);

    if (method === "email") {
      const notificationService = require("../utils/notificationService");
      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #0c1a32;">SUVIDHA Verification</h2>
          <p>Your one-time passcode for email verification is:</p>
          <h1 style="letter-spacing: 6px; background: #f4f4f5; padding: 12px; text-align: center; border-radius: 6px;">${otp}</h1>
          <p style="color: #666; font-size: 13px;">Please enter this on the kiosk. It is valid for 10 minutes.</p>
        </div>
      `;

      const dispatchResult = await notificationService.dispatchEmail(citizen.email || normalizedValue, "Your Verification OTP", html);
      if (!dispatchResult.success) {
        return res.status(500).json({ success: false, message: dispatchResult.error || "Failed to send OTP email" });
      }
    } else {
      console.log(`OTP for ${method} ${normalizedValue}: ${otp}`);
    }

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    await AuditLog.logActivity({
      action: "otp_send",
      identifierType: method,
      identifierValue: normalizeIdentifier(method, value),
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
      status: "failure",
      errorMessage: error.message,
    });
    return res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

const verifyOTP = async (req, res) => {
  const { method, value, otp } = req.body;

  if (!method || !value || !otp) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({ success: false, message: "Invalid OTP format" });
  }

  const normalizedValue = normalizeIdentifier(method, value);

  try {
    let otpSession;
    let isVerified = false;

    if (method === "mobile") {
      const verifyResult = await otpService.verifyMobileOTP(normalizedValue, otp);
      if (verifyResult.success) {
        isVerified = true;
      }
    } else {
      otpSession = await OtpSession.findValidOTP(normalizedValue, method, otp);
      if (otpSession) {
        isVerified = true;
        await otpSession.markAsUsed();
      }
    }

    if (!isVerified) {
      await AuditLog.logActivity({
        action: "otp_verify",
        identifierType: method,
        identifierValue: normalizedValue,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        status: "failure",
        errorMessage: "Invalid or expired OTP",
      });
      return res.status(401).json({ success: false, message: "Invalid or expired OTP" });
    }

    let citizen = await Citizen.findByIdentifier(method, normalizedValue);
    if (!citizen) {
      if (method === "mobile") {
        const accountId = `ACT-${Math.floor(100000 + Math.random() * 900000)}`;
        try {
          citizen = await Citizen.create({
            id: `CIT-${Date.now()}`,
            fullName: `Citizen ${normalizedValue.slice(-4)}`,
            aadhaar: `99998888${normalizedValue.slice(-4)}`,
            mobile: normalizedValue,
            accountId
          });
        } catch (dbError) {
          if (dbError.code === 11000) {
            console.warn("Duplicate key during mobile on-the-fly registration, retrying with random credentials");
            const randomMobile = `8${Math.floor(100000000 + Math.random() * 900000000)}`;
            const randomAccountId = `ACT-${Math.floor(100000 + Math.random() * 900000)}`;
            citizen = await Citizen.create({
              id: `CIT-${Date.now()}`,
              fullName: `Citizen ${normalizedValue.slice(-4)}`,
              aadhaar: `99998888${normalizedValue.slice(-4)}`,
              mobile: randomMobile,
              accountId: randomAccountId
            });
          } else {
            throw dbError;
          }
        }
      } else {
        await AuditLog.logActivity({
          action: "otp_verify",
          identifierType: method,
          identifierValue: normalizedValue,
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
          status: "failure",
          errorMessage: "User not found",
        });
        return res.status(404).json({ success: false, message: "User not found" });
      }
    }

    const token = generateToken(citizen.id);
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    await UserSession.createSession(citizen.id, tokenHash, req.get("User-Agent"), req.ip, req.get("User-Agent"));

    await AuditLog.logActivity({
      citizenId: citizen.id,
      action: "login",
      identifierType: method,
      identifierValue: normalizedValue,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
      status: "success",
    });

    return res.json({
      success: true,
      message: "Login successful",
      citizen: {
        id: citizen.id,
        name: citizen.fullName,
        aadhaar: citizen.maskedAadhaar,
        mobile: citizen.maskedMobile,
        accountId: citizen.accountId,
      },
      token,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    await AuditLog.logActivity({
      action: "otp_verify",
      identifierType: method,
      identifierValue: normalizedValue,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
      status: "failure",
      errorMessage: error.message,
    });
    return res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
};

const logout = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(400).json({ success: false, message: "No token provided" });
  }

  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const session = await UserSession.findOne({ tokenHash, isActive: true });
    if (session) await session.deactivate();

    await AuditLog.logActivity({
      citizenId: req.user?.id,
      action: "logout",
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
      status: "success",
    });

    return res.json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    await AuditLog.logActivity({
      citizenId: req.user?.id,
      action: "logout",
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
      status: "failure",
      errorMessage: error.message,
    });
    return res.status(500).json({ success: false, message: "Failed to logout" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const maskedCitizen = {
      id: req.user.id,
      name: req.user.fullName,
      aadhaar: `****-****-${req.user.aadhaar.slice(-4)}`,
      mobile: `${req.user.mobile.slice(0, 5)}-${req.user.mobile.slice(-5)}`,
      accountId: req.user.accountId,
    };

    return res.json({ success: true, citizen: maskedCitizen });
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({ success: false, message: "Failed to get user info" });
  }
};

const login = async (req, res) => {
  const { method, value } = req.body;

  if (!method || !value) {
    return res.status(400).json({ success: false, message: "Authentication method and value are required" });
  }

  const validMethods = ["aadhaar", "mobile", "account", "email"];
  if (!validMethods.includes(method)) {
    return res.status(400).json({ success: false, message: "Invalid authentication method" });
  }

  const normalizedValue = normalizeIdentifier(method, value);
  const validationError = validateIdentifier(method, normalizedValue);
  if (validationError) {
    return res.status(400).json({ success: false, message: validationError });
  }

  try {
    const citizen = await Citizen.findByIdentifier(method, normalizedValue);

    if (!citizen) {
      await AuditLog.logActivity({
        action: "login",
        identifierType: method,
        identifierValue: normalizedValue,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        status: "failure",
        errorMessage: "User not found",
      });
      return res.status(404).json({ success: false, message: "User not found with provided credentials" });
    }

    const token = generateToken(citizen.id);
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    await UserSession.createSession(citizen.id, tokenHash, req.get("User-Agent"), req.ip, req.get("User-Agent"));

    await AuditLog.logActivity({
      citizenId: citizen.id,
      action: "login",
      identifierType: method,
      identifierValue: normalizedValue,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
      status: "success",
    });

    return res.json({
      success: true,
      message: "Login successful",
      citizen: {
        id: citizen.id,
        name: citizen.fullName,
        aadhaar: citizen.maskedAadhaar,
        mobile: citizen.maskedMobile,
        accountId: citizen.accountId,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    await AuditLog.logActivity({
      action: "login",
      identifierType: method,
      identifierValue: normalizedValue,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
      status: "failure",
      errorMessage: error.message,
    });
    return res.status(500).json({ success: false, message: "Failed to login" });
  }
};

const twilio = require("twilio");

const initiateSupportCall = async (req, res) => {
  const { roomName } = req.body;
  if (!roomName) {
    return res.status(400).json({ success: false, message: "Room name is required" });
  }

  const officerPhonesStr = process.env.SUPPORT_OFFICER_PHONES || "";
  const phones = officerPhonesStr
    .split(",")
    .map(p => p.trim())
    .filter(p => p.startsWith("+") && p.length > 5);

  if (phones.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No support officer phone numbers configured. Please set SUPPORT_OFFICER_PHONES in backend/.env"
    });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return res.status(500).json({ success: false, message: "Twilio credentials not configured in backend/.env" });
  }

  const client = twilio(accountSid, authToken);
  // Extremely short & clean URL to bypass telecom spam filters and guarantee SMS delivery
  const smsJoinUrl = `https://p2p.mirotalk.com/join?room=${roomName}`;

  const smsPromises = phones.map(phone => {
    return client.messages.create({
      body: `🚨 SUVIDHA Kiosk: Video Support request! Join here: ${smsJoinUrl}`,
      from: fromNumber,
      to: phone
    });
  });

  const voicePromises = phones.map(phone => {
    return client.calls.create({
      twiml: `<Response><Say voice="alice" language="en-IN">Attention! You have an incoming video support call request from the SUVIDHA Smart Kiosk. We have sent the video link to your phone via SMS. Please open the link to answer the call.</Say></Response>`,
      to: phone,
      from: fromNumber
    });
  });

  try {
    await Promise.all([...smsPromises, ...voicePromises]);
    console.log(`Successfully dispatched support call notifications to ${phones.join(", ")}`);
    return res.json({ success: true, message: `Video call request sent to support officer(s). Your phone will ring shortly!` });
  } catch (err) {
    console.error("Failed to dispatch support call notifications:", err);
    return res.status(500).json({ success: false, message: "Failed to connect call via Twilio: " + err.message });
  }
};

module.exports = {
  signup,
  login,
  sendOTP,
  verifyOTP,
  logout,
  getCurrentUser,
  initiateSupportCall,
};
