const mongoose = require('mongoose');

const otpSessionSchema = new mongoose.Schema({
    identifier: {
        type: String,
        required: true,
        trim: true
    },
    identifierType: {
        type: String,
        required: true,
        enum: ['aadhaar', 'mobile', 'account', 'email']
    },
    otpCode: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{6}$/.test(v);
            },
            message: 'OTP must be 6 digits'
        }
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        required: true,
        default: function() {
            return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        }
    },
    attempts: {
        type: Number,
        default: 0
    },
    maxAttempts: {
        type: Number,
        default: 3
    }
}, {
    timestamps: true
});

// Indexes
otpSessionSchema.index({ identifier: 1, identifierType: 1 });

otpSessionSchema.index({ isUsed: 1 });

// TTL index to automatically delete expired documents
otpSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to find valid OTP
otpSessionSchema.statics.findValidOTP = async function(identifier, identifierType, otpCode) {
    return await this.findOne({
        identifier,
        identifierType,
        otpCode,
        isUsed: false,
        expiresAt: { $gt: new Date() },
        attempts: { $lt: 3 }
    });
};

// Static method to create OTP session
otpSessionSchema.statics.createOTP = async function(identifier, identifierType, otpCode) {
    // Mark previous OTPs as used
    await this.updateMany(
        { identifier, identifierType, isUsed: false },
        { isUsed: true }
    );

    // Create new OTP session
    return await this.create({
        identifier,
        identifierType,
        otpCode,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });
};

// Instance method to mark as used
otpSessionSchema.methods.markAsUsed = function() {
    this.isUsed = true;
    return this.save();
};

// Instance method to increment attempts
otpSessionSchema.methods.incrementAttempts = function() {
    this.attempts += 1;
    return this.save();
};

module.exports = mongoose.model('OtpSession', otpSessionSchema);
