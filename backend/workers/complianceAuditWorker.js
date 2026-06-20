const { encrypt } = require('../utils/encryptionEngine');

/**
 * Compliance Audit Worker handles masking PII data 
 * to adhere with Data Sovereignty rules, and preparing it for Audit Ledgers.
 */
const maskAndSyncAuditLog = async (logData) => {
    console.log('🔒 Starting Data Sovereignty Compliance processing...');

    // Extract raw payload
    const { citizenId, action, identifierType, identifierValue, ipAddress, userAgent, status } = logData;

    // Mask/Encrypt PII fields using the AES-256 Engine
    const auditRecord = {
        action,
        status,
        timestamp: new Date().toISOString(),
        // Identifying information must not be stored in plaintext in the open ledger
        citizenIdHash: encrypt(citizenId),
        identifierType,
        hashedIdentifier: encrypt(identifierValue),
        // Additional masking for IP/UA
        anonymizedIp: ipAddress ? `${ipAddress.split('.')[0]}.${ipAddress.split('.')[1]}.***.***` : 'Unknown',
        userAgentHash: encrypt(userAgent)
    };

    console.log('🛡️ Generated Masked Compliance Audit Record:', auditRecord);

    // TODO: Forward this exact payload to the "Sovereign Regional Database" via REST API or second Kafka cluster
    // e.g. await axios.post(process.env.REGIONAL_LEDGER_URL, auditRecord);
    return auditRecord;
};

module.exports = { maskAndSyncAuditLog };
