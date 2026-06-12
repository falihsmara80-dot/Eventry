const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

let connecting;

// Lazily connect on first use so the server can boot even if
// Redis isn't available yet (useful in local dev).
async function getRedisClient() {
  if (!redisClient.isOpen && !connecting) {
    connecting = redisClient.connect().catch((err) => {
      connecting = null;
      throw err;
    });
  }
  if (connecting) await connecting;
  return redisClient;
}

module.exports = { redisClient, getRedisClient };
