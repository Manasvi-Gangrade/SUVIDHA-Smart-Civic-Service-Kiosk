const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    citizenId: {
        type: String,
        ref: 'Citizen'
    },
    action: {
        type: String,
        required: true,
        enum: ['otp_send', 'otp_verify', 'login', 'logout', 'session_expired', 'access_denied']
    },
    identifierType: {
        type: String,
        enum: ['aadhaar', 'mobile', 'account', 'email']
    },
    identifierValue: {
        type: String,
        trim: true
    },
    ipAddress: {
        type: String,
        trim: true
    },
    userAgent: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ['success', 'failure']
    },
    errorMessage: {
        type: String,
        trim: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// Indexes for better performance
auditLogSchema.index({ citizenId: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ status: 1 });
auditLogSchema.index({ createdAt: 1 });
auditLogSchema.index({ ipAddress: 1 });

// Static method to log activity
auditLogSchema.statics.logActivity = async function(data) {
    const {
        citizenId,
        action,
        identifierType,
        identifierValue,
        ipAddress,
        userAgent,
        status,
        errorMessage,
        metadata = {}
    } = data;

    return await this.create({
        citizenId,
        action,
        identifierType,
        identifierValue,
        ipAddress,
        userAgent,
        status,
        errorMessage,
        metadata
    });
};

// Static method to get failed login attempts
auditLogSchema.statics.getFailedAttempts = async function(identifier, identifierType, timeWindow = 15) {
    const since = new Date(Date.now() - timeWindow * 60 * 1000);
    
    return await this.countDocuments({
        identifierValue: identifier,
        identifierType,
        action: 'otp_verify',
        status: 'failure',
        createdAt: { $gte: since }
    });
};

// Static method to get user activity summary
auditLogSchema.statics.getUserActivity = async function(citizenId, limit = 50) {
    return await this.find({ citizenId })
        .sort({ createdAt: -1 })
        .limit(limit);
};

// Virtual for formatted timestamp
auditLogSchema.virtual('formattedTimestamp').get(function() {
    return this.createdAt.toISOString();
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
