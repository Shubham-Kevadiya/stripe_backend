import express from "express";
import webhookController from "./webhook.controller.js";

const webhookRoute = express.Router();

webhookRoute.post(
  "/",
  express.raw({ type: "application/json" }),
  webhookController.listenToWebhook
);

export default webhookRoute;
