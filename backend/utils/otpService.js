const twilio = require('twilio');
require('dotenv').config();

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

let client;
if (accountSid && authToken && accountSid.startsWith('AC')) {
    client = twilio(accountSid, authToken);
} else {
    console.warn('Twilio credentials not found or invalid (must start with AC). Mobile OTP will not work.');
}

// Memory map to hold custom generated OTPs when Twilio Verify SID is not present
const tempOtps = new Map();

/**
 * Validates and formats the phone number to E.164.
 * Currently assumes +91 if 10 digits are provided.
 */
const formatPhoneNumber = (phoneNumber) => {
    let cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `+91${cleaned}`;
    }
    if (phoneNumber.startsWith('+')) {
        return phoneNumber;
    }
    return `+${cleaned}`;
};

/**
 * Sends an OTP to the mobile number using Twilio Verify API or standard SMS fallback.
 */
const sendMobileOTP = async (phoneNumber) => {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 1. If Twilio client is configured but Verify Service SID is not set or is placeholder
    if (client && (!verifyServiceSid || verifyServiceSid.startsWith('your_') || verifyServiceSid === '')) {
        try {
            const twilioNumber = process.env.TWILIO_PHONE_NUMBER || '+10000000000';
            const message = await client.messages.create({
                body: `Your SUVIDHA Kiosk verification OTP is ${code}. Please do not share this code.`,
                from: twilioNumber,
                to: formattedNumber
            });
            
            // Store it in memory (expires in 10 minutes)
            tempOtps.set(formattedNumber, { code, expires: Date.now() + 10 * 60 * 1000 });
            
            console.log(`\n💬 [TWILIO SMS] Sent standard OTP to ${formattedNumber} (SID: ${message.sid})\n`);
            return { 
                success: true, 
                sid: message.sid,
                status: 'pending' 
            };
        } catch (error) {
            console.error('Twilio standard SMS send error:', error);
            return { 
                success: false, 
                message: error.message || 'Failed to send mobile OTP via SMS' 
            };
        }
    }

    // 2. If Twilio client is NOT configured at all
    if (!client) {
        if (process.env.NODE_ENV === 'development') {
            console.log(`\n💬 [SMS SIMULATION] Sent OTP to ${formattedNumber}. (Development Mode: Use any 6-digit OTP to verify)\n`);
            return { 
                success: true, 
                sid: 'MOCK_VERIFY_SID',
                status: 'pending' 
            };
        }
        return { 
            success: false, 
            message: 'Twilio service not configured' 
        };
    }

    // 3. Twilio client is configured AND Verify Service SID is set
    try {
        const verification = await client.verify.v2.services(verifyServiceSid)
            .verifications
            .create({ to: formattedNumber, channel: 'sms' });

        return { 
            success: true, 
            sid: verification.sid,
            status: verification.status 
        };
    } catch (error) {
        console.error('Twilio Verify Send OTP Error:', error);
        // Fallback to standard SMS if Verify Service fails (e.g. invalid SID)
        try {
            const twilioNumber = process.env.TWILIO_PHONE_NUMBER || '+10000000000';
            const message = await client.messages.create({
                body: `Your SUVIDHA Kiosk verification OTP is ${code}. Please do not share this code.`,
                from: twilioNumber,
                to: formattedNumber
            });
            tempOtps.set(formattedNumber, { code, expires: Date.now() + 10 * 60 * 1000 });
            console.log(`\n💬 [TWILIO FALLBACK SMS] Sent standard OTP to ${formattedNumber} (SID: ${message.sid})\n`);
            return { 
                success: true, 
                sid: message.sid,
                status: 'pending' 
            };
        } catch (smsError) {
            console.error('Twilio fallback SMS send error:', smsError);
            return { 
                success: false, 
                message: error.message || 'Failed to send mobile OTP' 
            };
        }
    }
};

/**
 * Verifies the OTP provided by the user using Twilio Verify API or standard SMS fallback.
 */
const verifyMobileOTP = async (phoneNumber, code) => {
    const formattedNumber = formatPhoneNumber(phoneNumber);

    // 1. Check local tempOtps memory first
    const record = tempOtps.get(formattedNumber);
    if (record) {
        if (record.code === code && record.expires > Date.now()) {
            tempOtps.delete(formattedNumber); // consume OTP
            return { success: true };
        }
    }

    // 2. If Twilio client is not configured
    if (!client) {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[DEV] Verifying simulated mobile OTP for ${phoneNumber} with code: ${code}`);
            return { success: true };
        }
        return { 
            success: false, 
            message: 'Twilio service not configured' 
        };
    }

    // 3. If Verify Service SID is not set, but Twilio client is (means we used standard SMS flow)
    if (!verifyServiceSid || verifyServiceSid.startsWith('your_') || verifyServiceSid === '') {
        return { 
            success: false, 
            message: 'Invalid or expired OTP' 
        };
    }

    // 4. Verify via Twilio Verify Service API
    try {
        const verificationCheck = await client.verify.v2.services(verifyServiceSid)
            .verificationChecks
            .create({ to: formattedNumber, code });

        if (verificationCheck.status === 'approved') {
            return { success: true };
        } else {
            return { 
                success: false, 
                message: 'Invalid or expired OTP' 
            };
        }
    } catch (error) {
        console.error('Twilio Verify OTP Error:', error);
        return { 
            success: false, 
            message: error.message || 'Failed to verify mobile OTP' 
        };
    }
};

module.exports = {
    sendMobileOTP,
    verifyMobileOTP,
    formatPhoneNumber
};
