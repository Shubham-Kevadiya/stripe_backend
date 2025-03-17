import Joi from 'joi';

const getAllFilteredPurchaseOfUserSchema = Joi.object({
  isCanceled: Joi.boolean().optional(),
  isPaused: Joi.boolean().optional(),
  isFinished: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  paymentFailed: Joi.boolean().optional(),
  type: Joi.string().valid('one-time', 'subscription').optional(),
});

export default {
  getAllFilteredPurchaseOfUserSchema,
};
