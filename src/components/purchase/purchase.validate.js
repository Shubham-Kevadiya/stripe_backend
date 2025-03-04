import Joi from "joi";

const createPurchaseSchema = Joi.object({
  planType: Joi.string().required(),
  amount: Joi.number().required(),
  interval: Joi.string().required(),
});

export default {
  createPurchaseSchema,
};
