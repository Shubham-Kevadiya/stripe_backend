import Joi from 'joi';

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
  interval: Joi.string().valid('week', 'month', 'year').required(),
  planType: Joi.string().required(),
  amount: Joi.number().required(),
  promocodeId: Joi.string().optional(),
});

const updateSubscriptionSchema = Joi.object({
  paymentMethodId: Joi.string().required(),
});

const validatePurchaseIdSchema = Joi.object({
  purchaseId: Joi.string().required(),
});

const cancelSubscriptionSchema = Joi.object({
  purchaseId: Joi.string().required(),
  reason: Joi.string().required(),
});

export default {
  createSubscriptionSchema,
  updateSubscriptionSchema,
  validatePurchaseIdSchema,
  cancelSubscriptionSchema,
};
