import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js';
import { ExpressAdapter } from '@bull-board/express';
import bodyParser from 'body-parser';
import { RedisStore } from 'connect-redis';
import express from 'express';
import session from 'express-session';
import {
  deleteSubscriptionQueue,
  failedIntentQueue,
  successIntentQueue,
} from './components/webhook/webhook.service.js';
import config from './config/config.js';
import errorCodes from './constants/errorCodes.js';
import {
  deleteSubscriptionWorker,
  failedIntentWorker,
  successIntentWorker,
} from './helper/worker.js';
import apiRoute from './indexRoute.js';
import { connectToDatabase } from './lib/dbConnection.js';
import { redisClient, redisConnection } from './lib/redisConnection.js';

const port = config.port.port || 3000;
const app = express();

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/ui');

createBullBoard({
  queues: [
    new BullMQAdapter(successIntentQueue),
    new BullMQAdapter(failedIntentQueue),
    new BullMQAdapter(deleteSubscriptionQueue),
  ],
  serverAdapter,
});

app.use('/ui', serverAdapter.getRouter());

app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhook/') {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: config.redis.session_secret,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);

console.log(
  'success intent Worker is runnung',
  successIntentWorker.isRunning()
);
console.log('failed intent Worker is runnung', failedIntentWorker.isRunning());
console.log(
  'delete subscription Worker is runnung',
  deleteSubscriptionWorker.isRunning()
);

app.use('/api', apiRoute);

app.use('/', (err, req, res, next) => {
  console.log({ err });

  const errorNames = Object.keys(errorCodes);
  const errorMsg = err.message;
  const errorMatch = errorNames.includes(errorMsg);
  if (errorMatch) {
    const status = errorCodes[errorMsg].httpStatusCode;
    const code = errorCodes[errorMsg].body.code;
    const message = errorCodes[errorMsg].body.message;
    res.status(status).json({ code, message });
  } else {
    res.status(err.status || 500).json({
      code: err.code || 'server crashed',
      message: err.message || 'Server Crashed',
    });
  }
});

connectToDatabase();
redisConnection();

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
