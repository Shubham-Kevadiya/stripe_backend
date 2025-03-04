import Joi from "joi";

const createPaymentIntentSchema = Joi.object({
  paymentMethod: Joi.object({
    id: Joi.string().required(),
    type: Joi.string().required(),
  }),
  planId: Joi.string().required(),
  planType: Joi.string().valid("one-time", "subscription").required(),
  interval: Joi.string().valid("week", "month", "year").required(),
  amount: Joi.number().required(),
  isAutoPaymentSetup: Joi.boolean().required(),
});

const confirmPaymentIntentSchema = Joi.object({
  paymentMethod: Joi.string().required(),
});

export default {
  createPaymentIntentSchema,
  confirmPaymentIntentSchema,
};
