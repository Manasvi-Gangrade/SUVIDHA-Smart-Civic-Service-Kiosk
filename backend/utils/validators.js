const validator = require('validator');

// Validate Aadhaar number (12 digits)
const validateAadhaar = (aadhaar) => {
    if (!aadhaar) return false;
    return /^\d{12}$/.test(aadhaar);
};

// Validate mobile number (10 digits)
const validateMobile = (mobile) => {
    if (!mobile) return false;
    return /^[6-9]\d{9}$/.test(mobile);
};

// Validate account ID (alphanumeric, 5-20 chars)
const validateAccount = (accountId) => {
    if (!accountId) return false;
    return /^[A-Za-z0-9]{5,20}$/.test(accountId);
};

// Validate OTP (6 digits)
const validateOTP = (otp) => {
    if (!otp) return false;
    return /^\d{6}$/.test(otp);
};

// Validate email (optional field)
const validateEmail = (email) => {
    if (!email) return true; // Email is optional
    return validator.isEmail(email);
};

// Validate full name (2-100 chars, letters and spaces only)
const validateFullName = (name) => {
    if (!name) return false;
    return /^[A-Za-z\s]{2,100}$/.test(name.trim());
};

// Sanitize input to prevent XSS
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return validator.escape(input.trim());
};

// Validate IP address
const validateIP = (ip) => {
    return validator.isIP(ip);
};

// Generic validation function
const validateField = (field, value, rules) => {
    const errors = [];
    
    if (rules.required && (!value || value === '')) {
        errors.push(`${field} is required`);
        return { isValid: false, errors };
    }
    
    if (value && rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
    }
    
    if (value && rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} must not exceed ${rules.maxLength} characters`);
    }
    
    if (value && rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${field} format is invalid`);
    }
    
    if (value && rules.custom && !rules.custom(value)) {
        errors.push(`${field} is not valid`);
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

module.exports = {
    validateAadhaar,
    validateMobile,
    validateAccount,
    validateOTP,
    validateEmail,
    validateFullName,
    sanitizeInput,
    validateIP,
    validateField
};
