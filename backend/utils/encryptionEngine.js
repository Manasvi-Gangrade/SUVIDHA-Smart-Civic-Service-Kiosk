const crypto = require('crypto');

// The encryption key should ideally come from environment variables.
// A consistent 32-byte key is required for AES-256-CBC.
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.scryptSync('kiosk-secret-key-2026', 'salt', 32);
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

/**
 * Encrypts a plain text string using AES-256-CBC.
 * Returns in format: iv:encryptedData
 */
function encrypt(text) {
    if (!text) return text;
    // Prefix to check if already encrypted to avoid double encryption
    if (text.startsWith('enc:')) return text;

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    
    let encrypted = cipher.update(String(text));
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    return `enc:${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Decrypts an AES-256-CBC encrypted string.
 * Supports legacy unencrypted strings.
 */
function decrypt(text) {
    if (!text) return text;
    if (!String(text).startsWith('enc:')) {
        // Return original if it's not encrypted (backward compatibility with existing unencrypted data)
        return text;
    }

    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts[1], 'hex');
        const encryptedText = Buffer.from(textParts[2], 'hex');
        
        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        
        return decrypted.toString();
    } catch (error) {
        console.error('Decryption failed:', error);
        return null;
    }
}

module.exports = {
    encrypt,
    decrypt
};
