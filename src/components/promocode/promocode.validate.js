import Joi from "joi";

const createPromocodeSchema = Joi.object({
  promocodeFor: Joi.string().valid("one-time", "subscription").required(),
  coupenName: Joi.string().when("promocodeFor", {
    is: "subscription",
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  promocode: Joi.string().required(),
  currency: Joi.string().required(),
  duration: Joi.string().valid("forever", "once", "repeating").required(),
  // .when("promocodeFor", {
  //   is: "subscription",
  //   then: Joi.required(),
  //   otherwise: Joi.forbidden(),
  // })
  durationInMonths: Joi.number().when("promocodeFor", {
    is: "subscription",
    then: Joi.when("duration", {
      is: "repeating",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    otherwise: Joi.forbidden(),
  }),
  discountInAmount: Joi.number().required().allow(0),
  discountInPercentage: Joi.number().when("discountInAmount", {
    is: 0,
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  specificCustomer: Joi.string().optional(),
  maxRedumption: Joi.number().optional(),
  minAmount: Joi.number().optional(),
  isFirstTimeOnly: Joi.boolean().optional(),
  plan: Joi.array().optional(),
});

const updatePromocodeSchema = Joi.object({
  coupenName: Joi.string().optional().allow(""),
  isActive: Joi.boolean().optional(),
});

const getActivePromocodeAccordingToPlanSchema = Joi.object({
  amount: Joi.number().required(),
  currency: Joi.string().required(),
});

const deletePromocodeSchema = Joi.object({
  wantToRemoveFromExistingSubscription: Joi.boolean().required(),
});

export default {
  createPromocodeSchema,
  updatePromocodeSchema,
  getActivePromocodeAccordingToPlanSchema,
  deletePromocodeSchema,
};
