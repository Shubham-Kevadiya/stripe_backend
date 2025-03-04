import Joi from "joi";

const createSubscriptionSchema = Joi.object({
  paymentMethodId: Joi.string().required(),
  planId: Joi.string().required(),
  priceId: Joi.array()
    .items(
      Joi.object({
        price: Joi.string().required(),
      })
    )
    .required(),
  interval: Joi.string().valid("week", "month", "year").required(),
  planType: Joi.string().required(),
  amount: Joi.number().required(),
});

const validatePurchaseIdSchema = Joi.object({
  purchaseId: Joi.string().required(),
});

const getAllFilteredSubscriptionOfUserSchema = Joi.object({
  isCanceled: Joi.boolean().optional(),
  isPaused: Joi.boolean().optional(),
  isFinished: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  paymentFailed: Joi.boolean().optional(),
  type: Joi.string().valid("one-time", "subscription").optional(),
});

export default {
  createSubscriptionSchema,
  validatePurchaseIdSchema,
  getAllFilteredSubscriptionOfUserSchema,
};
