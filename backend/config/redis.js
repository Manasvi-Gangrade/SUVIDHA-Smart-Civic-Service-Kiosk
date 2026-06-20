const redis = require('redis');

const isRedisEnabled = process.env.REDIS_ENABLED !== 'false';
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const client = redis.createClient({
    url: redisUrl,
    socket: {
        connectTimeout: Number(process.env.REDIS_CONNECT_TIMEOUT_MS || 3000),
        // Avoid endless retries/log spam in local dev when Redis is not running.
        reconnectStrategy: () => false,
    },
});

client.on('error', (err) => console.error('❌ Redis Client Error:', err.message));
client.on('connect', () => console.log('✅ Redis Client connected successfully'));

const connectRedis = async () => {
    if (!isRedisEnabled) {
        return false;
    }

    if (!client.isOpen) {
        try {
            await client.connect();
        } catch (error) {
            console.warn(`🔶 Redis unavailable at ${redisUrl}. Continuing without cache.`);
            return false;
        }
    }

    return true;
};

const getRedisStatus = () => {
    if (!isRedisEnabled) {
        return {
            enabled: false,
            connected: false,
            status: 'disabled',
            url: redisUrl,
        };
    }

    return {
        enabled: true,
        connected: client.isReady,
        status: client.isReady ? 'connected' : (client.isOpen ? 'connecting' : 'disconnected'),
        url: redisUrl,
    };
};

/**
 * Utility to get cached data or execute a fetch function and cache the result.
 */
const getOrSetCache = async (key, fetchFn, expireSeconds = 300) => {
    try {
        const connected = await connectRedis();
        if (!connected) {
            return await fetchFn();
        }

        const cachedData = await client.get(key);
        if (cachedData) {
            console.log(`⚡ Cache hit for key: ${key}`);
            return JSON.parse(cachedData);
        }
        
        console.log(`🐌 Cache miss. Fetching for key: ${key}`);
        const freshData = await fetchFn();
        if (freshData) {
            await client.setEx(key, expireSeconds, JSON.stringify(freshData));
        }
        return freshData;
    } catch (error) {
        console.error('Redis Cache Error, falling back to db fetch:', error);
        return await fetchFn(); // Fallback if redis fails
    }
};

module.exports = {
    client,
    connectRedis,
    getOrSetCache,
    getRedisStatus
};
