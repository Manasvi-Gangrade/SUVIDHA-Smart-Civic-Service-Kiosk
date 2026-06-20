const { Kafka } = require('kafkajs');

const isKafkaEnabled = process.env.KAFKA_ENABLED !== 'false';
const kafkaBroker = process.env.KAFKA_BROKER || 'localhost:9092';

const kafka = new Kafka({
  clientId: 'smartcity-kiosk-backend',
  brokers: [kafkaBroker],
  connectionTimeout: 3000, // Fail fast instead of retrying for minutes
  requestTimeout: 3000,
  // Authentication can be added here for mTLS with Kafka
});

const producer = kafka.producer();
let isConnected = false;

const connectProducer = async () => {
  if (!isKafkaEnabled) {
    return false;
  }

  if (isConnected) return;
  try {
    await producer.connect();
    isConnected = true;
    console.log('✅ Kafka Producer connected successfully');
  } catch (error) {
    console.warn(`🔶 Kafka unavailable at ${kafkaBroker}. Continuing without queue.`);
  }
};

const getKafkaStatus = () => ({
  enabled: isKafkaEnabled,
  broker: kafkaBroker,
  connected: isConnected,
  status: !isKafkaEnabled ? 'disabled' : (isConnected ? 'connected' : 'disconnected'),
});

const sendToQueue = async (topic, message) => {
  try {
    await connectProducer();
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    return true;
  } catch (error) {
    console.error(`❌ Failed to send message to Kafka topic ${topic}:`, error);
    return false;
  }
};

module.exports = {
  kafka,
  producer,
  connectProducer,
  sendToQueue,
  getKafkaStatus
};
