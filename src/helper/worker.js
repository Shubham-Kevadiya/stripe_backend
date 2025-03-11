import { Worker } from "bullmq";
import webhookHelper from "./webhook.helper.js";
import config from "../config/config.js";

let failedTask = [];

export const successIntentWorker = new Worker(
  "success-intent-queue",
  async (job) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      console.log(`Job ${job.id} is in process from success-intent-queue`);
      await webhookHelper.paymentIntentSuccessHelper(job.data.intentId);
    } catch (error) {
      console.log(error);
    }
  },
  {
    connection: {
      host: config.redis.host,
      port: config.redis.port,
      // password: process.env.REDIS_PASSWORD,
    },
  }
);

export const failedIntentWorker = new Worker(
  "failed-intent-queue",
  async (job) => {
    try {
      console.log(`Job ${job.id} is in process from failed-intent-queue`);
      const data = job.data;
      await webhookHelper.paymentIntentFailHelper(data);
    } catch (error) {
      console.log(error);
    }
  },
  {
    connection: {
      password: process.env.REDIS_PASSWORD,
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
    },
  }
);

export const deleteSubscriptionWorker = new Worker(
  "delete-suscription-queue",
  async (job) => {
    try {
      console.log(`Job ${job.id} is in process from delete-suscription-queue`);
      const data = job.data;
      await webhookHelper.subscriptionCancelHelper(data);
    } catch (error) {
      console.log(error);
    }
  },
  {
    connection: {
      password: process.env.REDIS_PASSWORD,
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
    },
  }
);

successIntentWorker.on("failed", async (job, error) => {
  console.log(
    `Success Intent Queue job with jobId ${job.id} failed. Error:`,
    error
  );
  try {
    if ((error.statusCode = 429)) {
      try {
        await webhookHelper.paymentIntentSuccessHelper(job.data.intentId);
      } catch (error) {
        failedTask.push({
          id: job.data.id,
          metadata: job.data.metadata,
          jobId: job.id,
          failedReason: job.failedReason,
        });

        console.log(
          `Success Intent Queue job with jobId ${job.id} failed. Error:`,
          error
        );
      }
    } else {
      failedTask.push({
        id: job.data.id,
        metadata: job.data.metadata,
        jobId: job.id,
        failedReason: job.failedReason,
      });

      console.log(
        `Success Intent Queue job with jobId ${job.id} failed. Error:`,
        error
      );
    }
  } catch (error) {
    console.log("Error from Success Intent Queue failed status", error);
  }
});

successIntentWorker.on("completed", (job, result) => {
  console.log(`Success Intent Queue job with jobId ${job.id} completed. `);
});

failedIntentWorker.on("failed", async (job, error) => {
  try {
    failedTask.push({
      id: job.data.id,
      metadata: job.data.metadata,
      jobId: job.id,
      failedReason: job.failedReason,
    });

    console.log(
      `Failed Intent Queue job with jobId ${job.id} failed. Error:`,
      error
    );
  } catch (error) {
    console.log("Error from Failed Intent Queue failed status", error);
  }
});

deleteSubscriptionWorker.on("failed", async (job, error) => {
  try {
    failedTask.push({
      id: job.data.id,
      metadata: job.data.metadata,
      jobId: job.id,
      failedReason: job.failedReason,
    });

    console.log(
      `Delete Subscription Queue job with jobId ${job.id} failed. Error:`,
      error
    );
  } catch (error) {
    console.log("Error from Delete Subscription Queue failed status", error);
  }
});
