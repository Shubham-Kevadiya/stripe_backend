import Joi from "joi";

const createProductSchema = Joi.object({
  name: Joi.string().required(),
  oneTimePrice: Joi.array()
    .items(
      Joi.object({
        interval: Joi.string().valid("Week", "month", "year").required(),
        amount: Joi.number().required(),
      })
    )
    .required(),
  subscriptionPrice: Joi.array()
    .items(
      Joi.object({
        interval: Joi.string().valid("Week", "month", "year").required,
        amount: Joi.number().required(),
      })
    )
    .when("oneTimePrice", {
      is: Joi.array().empty(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
  currency: Joi.string().required(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  oneTimePrice: Joi.array()
    .items(
      Joi.object({
        interval: Joi.string().valid("week", "month", "year").required(),
        amount: Joi.number().required(),
      })
    )
    .optional(),
  subscriptionPrice: Joi.array()
    .items(
      Joi.object({
        interval: Joi.string().valid("week", "month", "year").required(),
        amount: Joi.number().required(),
      })
    )
    .optional(),
  currency: Joi.string().optional(),
});

const getProductSchema = Joi.object({
  page: Joi.number().required(),
  limit: Joi.number().required(),
});

export default {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
};
