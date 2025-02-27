import Joi from "joi";

const createPaymentIntentSchema = Joi.object({
  paymentMethod: Joi.object({
    id: Joi.string().required(),
    type: Joi.string().required(),
  }),
  products: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string().required(),
        price: Joi.number().required(),
        productId: Joi.string().required(),
        currency: Joi.string().required(),
      })
    )
    .required(),
  isAutoPaymentSetup: Joi.boolean().required(),
});

export default {
  createPaymentIntentSchema,
};
