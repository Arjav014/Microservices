const { createClient } = require('redis');
const logger = require('./logger');

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_URL = process.env.REDIS_URL || `redis://${REDIS_HOST}:${REDIS_PORT}`;

const client = createClient({ url: REDIS_URL });

client.on('error', (err) => logger.warn('Redis Client Error', err));
client.on('connect', () => logger.info('Connected to Redis:', REDIS_URL));

(async () => {
  try {
    await client.connect();
  } catch (err) {
    logger.warn('Failed to connect to Redis on startup', err);
  }
})();

async function get(key) {
  try {
    const val = await client.get(key);
    return val;
  } catch (err) {
    logger.warn('Redis GET error', err);
    return null;
  }
}

async function set(key, value, ttlSeconds) {
  try {
    if (typeof value !== 'string') value = JSON.stringify(value);
    if (ttlSeconds) {
      await client.setEx(key, ttlSeconds, value);
    } else {
      await client.set(key, value);
    }
  } catch (err) {
    logger.warn('Redis SET error', err);
  }
}

module.exports = {
  client,
  get,
  set,
};
