import express from "express";
import paymentIntentValidate from "../../middleware/validation.js";
import paymentIntentValidateSchema from "./paymentIntent.validate.js";
import paymentIntentController from "./paymentIntent.controller.js";

const paymentIntentRoute = express.Router();

paymentIntentRoute.post(
  "/create",
  paymentIntentValidate.validateBodySchema(
    paymentIntentValidateSchema.createPaymentIntentSchema
  ),
  paymentIntentController.createPaymentIntent
);
paymentIntentRoute.post(
  "/confirm/:paymentIntentId",
  paymentIntentController.confirmPaymentIntent
);

export default paymentIntentRoute;
