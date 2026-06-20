const mongoose = require('mongoose');

const userSessionSchema = new mongoose.Schema({
    citizenId: {
        type: String,
        required: true,
        ref: 'Citizen'
    },
    tokenHash: {
        type: String,
        required: true,
        unique: true
    },
    deviceInfo: {
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
    isActive: {
        type: Boolean,
        default: true
    },
    expiresAt: {
        type: Date,
        required: true,
        default: function() {
            return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
        }
    },
    lastAccessed: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes
userSessionSchema.index({ citizenId: 1 });

userSessionSchema.index({ isActive: 1 });

// TTL index to automatically delete expired sessions
userSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to find active session by token hash
userSessionSchema.statics.findActiveSession = async function(tokenHash) {
    return await this.findOne({
        tokenHash,
        isActive: true,
        expiresAt: { $gt: new Date() }
    });
};

// Static method to create session
userSessionSchema.statics.createSession = async function(citizenId, tokenHash, deviceInfo, ipAddress, userAgent) {
    return await this.create({
        citizenId,
        tokenHash,
        deviceInfo,
        ipAddress,
        userAgent,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });
};

// Instance method to deactivate session
userSessionSchema.methods.deactivate = function() {
    this.isActive = false;
    return this.save();
};

// Instance method to update last accessed
userSessionSchema.methods.updateLastAccessed = function() {
    this.lastAccessed = new Date();
    return this.save();
};

// Pre-save middleware to update lastAccessed
userSessionSchema.pre('save', function(next) {
    if (this.isNew) {
        this.lastAccessed = new Date();
    }
    next();
});

module.exports = mongoose.model('UserSession', userSessionSchema);
