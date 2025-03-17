import dotenv from 'dotenv-safe';

dotenv.config({
  path: './.env',
  example: './.env.example',
});

export default {
  db: {
    db_url: process.env.DB_URL,
  },
  port: {
    port: process.env.PORT,
  },
  redis: {
    username: process.env.REDIS_USERNAME,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    session_secret: process.env.REDIS_SESSION_SECRET,
  },
  crypto: {
    aes_key: process.env.AES_KEY,
  },
  stipe: {
    secret_key: process.env.STRIPE_SECRET_KEY,
    webhook_secret: process.env.WEBHOOK_SERET,
  },
};
