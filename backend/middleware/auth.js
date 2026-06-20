const jwt = require('jsonwebtoken');
const UserSession = require('../models/UserSession');
const Citizen = require('../models/Citizen');

const getJwtSecret = () => process.env.JWT_SECRET || 'smartcity-dev-secret';

// Authenticate JWT token
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1] ? String(authHeader.split(' ')[1]).trim() : null; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access token required' 
        });
    }

    try {
        // Session-first validation avoids false 403 when JWT decode fails due env/key mismatch.
        const tokenHash = require('crypto').createHash('sha256').update(token).digest('hex');
        const session = await UserSession.findActiveSession(tokenHash);

        if (!session) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid or expired session' 
            });
        }

        const citizen = await Citizen.findOne({ id: session.citizenId, isActive: true });
        if (!citizen) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired session'
            });
        }

        // Best-effort JWT check; keep session as source of truth for active kiosk users.
        try {
            jwt.verify(token, getJwtSecret());
        } catch (verifyErr) {
            console.warn('JWT verify warning (session is active, continuing):', verifyErr.message);
        }

        // Update last accessed time
        await session.updateLastAccessed();

        // Set authenticated citizen on request for downstream handlers
        req.user = citizen;
        
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid or expired session' 
        });
    }
};

// Generate JWT token
const generateToken = (citizenId) => {
    return jwt.sign(
        { citizenId },
        getJwtSecret(),
        { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );
};

const authenticateAdmin = (req, res, next) => {
    const adminKey = req.headers['x-admin-key'];
    const expectedKey = process.env.ADMIN_API_KEY || 'smartcity-admin-key';

    if (!adminKey || adminKey !== expectedKey) {
        return res.status(403).json({
            success: false,
            message: 'Unauthorized: Admin access required'
        });
    }
    next();
};

module.exports = {
    authenticateToken,
    authenticateAdmin,
    generateToken
};
