// MongoDB initialization script
// Run this script to create initial data for the Smart City Kiosk

const mongoose = require('mongoose');
require('dotenv').config();

const Citizen = require('../models/Citizen');

const initializeData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartcity_kiosk');
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Citizen.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create sample citizens
        const citizens = [
            {
                id: 'CIT-2026-001',
                fullName: 'Rajesh Kumar',
                aadhaar: '123456789012',
                mobile: '9876543210',
                email: 'rajesh.kumar@email.com',
                accountId: 'ACC-MH-2026-7890',
                isActive: true
            },
            {
                id: 'CIT-2026-002',
                fullName: 'Priya Sharma',
                aadhaar: '234567890123',
                mobile: '8765432109',
                email: 'priya.sharma@email.com',
                accountId: 'ACC-MH-2026-7891',
                isActive: true
            },
            {
                id: 'CIT-2026-003',
                fullName: 'Amit Patel',
                aadhaar: '345678901234',
                mobile: '7654321098',
                email: 'amit.patel@email.com',
                accountId: 'ACC-MH-2026-7892',
                isActive: true
            },
            {
                id: 'CIT-2026-004',
                fullName: 'Sunita Reddy',
                aadhaar: '456789012345',
                mobile: '6543210987',
                email: 'sunita.reddy@email.com',
                accountId: 'ACC-MH-2026-7893',
                isActive: true
            }
        ];

        // Insert citizens
        const insertedCitizens = await Citizen.insertMany(citizens);
        console.log(`👥 Created ${insertedCitizens.length} sample citizens`);

        // Display created citizens
        console.log('\n📋 Created Citizens:');
        insertedCitizens.forEach((citizen, index) => {
            console.log(`${index + 1}. ${citizen.fullName} (${citizen.id})`);
            console.log(`   Aadhaar: ${citizen.maskedAadhaar}`);
            console.log(`   Mobile: ${citizen.maskedMobile}`);
            console.log(`   Account: ${citizen.accountId}`);
            console.log('');
        });

        console.log('✅ Database initialization completed successfully!');
        
    } catch (error) {
        console.error('❌ Error initializing database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
};

// Run the initialization
if (require.main === module) {
    initializeData();
}

module.exports = initializeData;
