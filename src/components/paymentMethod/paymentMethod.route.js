import express from "express";
import paymentMethodValidate from "../../middleware/validation.js";
import {
  createPaymentMethodSchema,
  updatePaymentMethodSchema,
} from "./paymentMethod.validate.js";
import {
  createPaymentMethod,
  deletePaymentMethodById,
  getPaymentMethodFromStripeById,
  getPaymentMethodOfUser,
  setDefaultPaymentMethod,
  updatePaymentMethod,
} from "./paymentMethod.controller.js";
const paymentMethodRoute = express.Router();

paymentMethodRoute.post(
  "/create",
  paymentMethodValidate.validateBodySchema(createPaymentMethodSchema),
  createPaymentMethod
);
paymentMethodRoute.post(
  "/update/:paymentMethodId",
  paymentMethodValidate.validateBodySchema(updatePaymentMethodSchema),
  updatePaymentMethod
);
paymentMethodRoute.post("/default/:paymentMethodId", setDefaultPaymentMethod);
paymentMethodRoute.get("/", getPaymentMethodOfUser);
paymentMethodRoute.get(
  "/stripe/:paymentMethodId",
  getPaymentMethodFromStripeById
);
paymentMethodRoute.delete("/:paymentMethodId", deletePaymentMethodById);

export default paymentMethodRoute;
