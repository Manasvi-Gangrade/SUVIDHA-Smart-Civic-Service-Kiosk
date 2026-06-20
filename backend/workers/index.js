const { kafka } = require('../config/kafka');
const connectDB = require('../config/database');
const { maskAndSyncAuditLog } = require('./complianceAuditWorker');

const consumer = kafka.consumer({ groupId: 'kiosk-backend-group' });

const runWorkers = async () => {
  try {
    await connectDB();
    await consumer.connect();
    console.log('✅ Kafka Consumer connected successfully');

    // Subscribe to topics
    await consumer.subscribe({ topic: 'kiosk-transactions', fromBeginning: false });
    await consumer.subscribe({ topic: 'kiosk-audit-logs', fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const payload = JSON.parse(message.value.toString());
        console.log(`📥 Received message on [${topic}]:`, payload);

        try {
          if (topic === 'kiosk-audit-logs') {
            await maskAndSyncAuditLog(payload);
          } else if (topic === 'kiosk-transactions') {
            // Process high-volume kiosk transaction here
            console.log('Processing kiosk transaction queue payload...', payload.id || 'N/A');
          }
        } catch (jobError) {
          console.error(`❌ Failed processing job in topic ${topic}:`, jobError);
        }
      },
    });

  } catch (error) {
    console.error('❌ Failed to start worker:', error);
  }
};

// Start workers if this file is run directly
if (require.main === module) {
  runWorkers();
}

module.exports = { runWorkers };
