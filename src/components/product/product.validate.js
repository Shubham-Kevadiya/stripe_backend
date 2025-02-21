import Joi from "joi";

const createProductSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  currency: Joi.string().required(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  price: Joi.number().optional(),
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
