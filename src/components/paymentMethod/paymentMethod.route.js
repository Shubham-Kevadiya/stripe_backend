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
import authenticateUser from "../../middleware/authenticateUser.js";
const paymentMethodRoute = express.Router();

paymentMethodRoute.post(
  "/create",
  authenticateUser.validateAuthIdToken,
  paymentMethodValidate.validateBodySchema(createPaymentMethodSchema),
  createPaymentMethod
);
paymentMethodRoute.put(
  "/update/:paymentMethodId",
  authenticateUser.validateAuthIdToken,
  paymentMethodValidate.validateBodySchema(updatePaymentMethodSchema),
  updatePaymentMethod
);
paymentMethodRoute.put(
  "/default/:paymentMethodId",
  authenticateUser.validateAuthIdToken,
  setDefaultPaymentMethod
);
paymentMethodRoute.get(
  "/stripe/:paymentMethodId",
  authenticateUser.validateAuthIdToken,
  getPaymentMethodFromStripeById
);
paymentMethodRoute.get(
  "/",
  authenticateUser.validateAuthIdToken,
  getPaymentMethodOfUser
);
paymentMethodRoute.delete(
  "/:paymentMethodId",
  authenticateUser.validateAuthIdToken,
  deletePaymentMethodById
);

export default paymentMethodRoute;
