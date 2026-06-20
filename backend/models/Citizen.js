const mongoose = require('mongoose');

const citizenSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    aadhaar: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^\d{12}$/.test(v);
            },
            message: 'Aadhaar must be 12 digits'
        }
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[6-9]\d{9}$/.test(v);
            },
            message: 'Mobile must be 10 digits starting with 6-9'
        }
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                if (!v) return true; // Email is optional
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Invalid email format'
        }
    },
    accountId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^[A-Za-z0-9\-]{5,30}$/.test(v);
            },
            message: 'Account ID must be 5-30 alphanumeric characters (hyphens allowed)'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better performance
citizenSchema.index({ isActive: 1 });

// Virtual for masked Aadhaar
citizenSchema.virtual('maskedAadhaar').get(function() {
    return `****-****-${this.aadhaar.slice(-4)}`;
});

// Virtual for masked mobile
citizenSchema.virtual('maskedMobile').get(function() {
    return `${this.mobile.slice(0, 5)}-${this.mobile.slice(-5)}`;
});

// Pre-save middleware
citizenSchema.pre('save', function(next) {
    // Trim string fields
    if (this.fullName) this.fullName = this.fullName.trim();
    if (this.email) this.email = this.email.trim();
    if (this.accountId) this.accountId = this.accountId.trim();
    next();
});

// Static method to find by identifier type
citizenSchema.statics.findByIdentifier = async function(identifierType, identifierValue) {
    const fieldMap = {
        aadhaar: 'aadhaar',
        mobile: 'mobile',
        account: 'accountId',
        email: 'email',
    };
    const mappedField = fieldMap[identifierType];
    if (!mappedField) return null;

    const query = { isActive: true };
    query[mappedField] = identifierValue;
    
    return await this.findOne(query);
};

module.exports = mongoose.model('Citizen', citizenSchema);
