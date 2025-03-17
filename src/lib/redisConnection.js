import { createClient } from 'redis';
import config from '../config/config.js';

const redisConfig = {
  username: config.redis.username,
  socket: {
    port: config.redis.port,
    host: config.redis.host,
  },
};

export const redisClient = createClient(redisConfig);

export const redisConnection = async () => {
  redisClient.on('connect', () => {
    console.log('Redis server connected');
  });

  redisClient.on('error', (err) => {
    console.log(err);
  });

  await redisClient.connect();
};
