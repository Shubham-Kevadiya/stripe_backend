import express from "express";
import subscriptionValidateSchema from "./subscription.validate.js";
import subscriptionController from "./subscription.controller.js";
import authenticateUser from "../../middleware/authenticateUser.js";
import subscriptionValidate from "../../middleware/validation.js";

const subscriptionRoute = express.Router();

subscriptionRoute.post(
  "/create",
  authenticateUser.validateAuthIdToken,
  subscriptionValidate.validateBodySchema(
    subscriptionValidateSchema.createSubscriptionSchema
  ),
  subscriptionController.createSubscription
);
subscriptionRoute.post(
  "/update/:subscriptionId",
  authenticateUser.validateAuthIdToken,
  subscriptionValidate.validateBodySchema(
    subscriptionValidateSchema.updateSubscriptionSchema
  ),
  subscriptionController.updateSubscription
);
subscriptionRoute.put(
  "/pause/:subscriptionId",
  authenticateUser.validateAuthIdToken,
  subscriptionValidate.validateBodySchema(
    subscriptionValidateSchema.validatePurchaseIdSchema
  ),
  subscriptionController.pauseSubscription
);
subscriptionRoute.put(
  "/resume/:subscriptionId",
  authenticateUser.validateAuthIdToken,
  subscriptionValidate.validateBodySchema(
    subscriptionValidateSchema.validatePurchaseIdSchema
  ),
  subscriptionController.resumeSubscription
);
subscriptionRoute.delete(
  "/cancel/:subscriptionId",
  authenticateUser.validateAuthIdToken,
  subscriptionValidate.validateBodySchema(
    subscriptionValidateSchema.cancelSubscriptionSchema
  ),
  subscriptionController.cancelSubscription
);
// subscriptionRoute.get(
//   "/:subscriptionId",
//   authenticateUser.validateAuthIdToken,
//   subscriptionController.getUpcomingInvoiceOfCustomer
// );

export default subscriptionRoute;
