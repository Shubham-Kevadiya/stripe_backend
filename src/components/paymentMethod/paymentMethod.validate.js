import Joi from "joi";

export const createPaymentMethodSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  address: Joi.object({
    city: Joi.string().required(),
    country: Joi.string().required(),
    line1: Joi.string().required(),
    line2: Joi.string().required(),
    postal_code: Joi.string().required(),
    state: Joi.string().required(),
  }),
});

export const updatePaymentMethodSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().optional(),
  phone: Joi.string().optional(),
  address: Joi.object({
    city: Joi.string().optional(),
    country: Joi.string().optional(),
    line1: Joi.string().optional(),
    line2: Joi.string().optional(),
    postal_code: Joi.string().optional(),
    state: Joi.string().optional(),
  }),
});
