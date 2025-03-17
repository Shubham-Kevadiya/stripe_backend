import express from 'express';
import paymentIntentValidate from '../../middleware/validation.js';
import paymentIntentValidateSchema from './paymentIntent.validate.js';
import paymentIntentController from './paymentIntent.controller.js';
import authenticateUser from '../../middleware/authenticateUser.js';

const paymentIntentRoute = express.Router();

paymentIntentRoute.post(
  '/create',
  authenticateUser.validateAuthIdToken,
  paymentIntentValidate.validateBodySchema(
    paymentIntentValidateSchema.createPaymentIntentSchema
  ),
  paymentIntentController.createPaymentIntent
);
paymentIntentRoute.post(
  '/confirm/:paymentIntentId',
  authenticateUser.validateAuthIdToken,
  paymentIntentValidate.validateBodySchema(
    paymentIntentValidateSchema.confirmPaymentIntentSchema
  ),
  paymentIntentController.confirmPaymentIntent
);

export default paymentIntentRoute;
