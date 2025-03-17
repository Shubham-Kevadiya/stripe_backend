import { Queue } from 'bullmq';
import config from '../../config/config.js';
import stripeHelper from '../../helper/stripe.helper.js';
// import { createBullBoard } from "@bull-board/api";
// import { BullMQAdapter } from "@bull-board/api/bullMQAdapter.js";
// import { ExpressAdapter } from "@bull-board/express";
// import webhookHelper from "../../helper/webhook.helper.js";

export const successIntentQueue = new Queue('success-intent-queue', {
  connection: {
    host: config.redis.host,
    port: config.redis.port,
    // password: process.env.REDIS_PASSWORD,
  },
});
export const failedIntentQueue = new Queue('failed-intent-queue', {
  connection: {
    host: config.redis.host,
    port: config.redis.port,
    // password: process.env.REDIS_PASSWORD,
  },
});
export const deleteSubscriptionQueue = new Queue('delete-suscription-queue', {
  connection: {
    host: config.redis.host,
    port: config.redis.port,
    // password: process.env.REDIS_PASSWORD,
  },
});

successIntentQueue.on('completed', ({ id }) => {
  console.log(`Job ${id} successfully added to queue`);
});

successIntentQueue.on('failed', ({ id }) => {
  console.log(`Job ${id} got error while adding to queue`);
});

successIntentQueue.on('waiting', ({ id }) => {
  console.log(`Job ${id} is in waiting to add to queue`);
});

const listenToWebhook = async ({ rowData, signature, endpointSecret }) => {
  try {
    const event = await stripeHelper.constructWebhookInStripe({
      rowData,
      signature,
      endpointSecret,
    });
    // const eventObj = event.data.object;
    const eventObj = {};
    for (const key in event.data.object) {
      eventObj[key] = event.data.object[key];
    }
    let task;
    console.log({ type: event.type });
    switch (event.type) {
      case 'payment_intent.succeeded':
        // console.log({ eventObj });
        // await webhookHelper.paymentIntentSuccessHelper(eventObj);
        task = await successIntentQueue.add(
          'success-intent',
          {
            // ...eventObj,
            intentId: eventObj.id,
          }
          // {
          //   attempts: 2,
          //   backoff: 2000,
          // }
        );
        console.log(`Job ${task.id} is added in success-intent-queue`);
        break;
      case 'payment_intent.payment_failed':
        // await webhookHelper.paymentIntentFailHelper(eventObj);
        task = await failedIntentQueue.add('failed-intent', { ...eventObj });
        console.log(`Job ${task.id} is added in failed-intent-queue`);
        break;
      case 'customer.subscription.deleted':
        // await webhookHelper.subscriptionCancelHelper(eventObj);
        task = await deleteSubscriptionQueue.add('deleted-subscription', {
          ...eventObj,
        });
        console.log(`Job ${task.id} is added in delete-suscription-queue`);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    // if ((error.statusCode = 429)) {
    // }
    console.log('error from webhook', { error });
    throw new Error(error.message);
  }
};

// const actionOnPaymentIntentFaild = async () => {};

export default {
  listenToWebhook,
  // actionOnPaymentIntentFaild,
};
