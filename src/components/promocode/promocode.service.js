import promocodeUtils from "../../utils/promocode.utils.js";
import stripeHelper from "../../helper/stripe.helper.js";
import productUtils from "../../utils/product.utils.js";
import paymentUtils from "../../utils/payment.utils.js";

const createPromocode = async (promocodeData) => {
  try {
    const existingPromocode = await promocodeUtils.getPromocodeByName(
      promocodeData.promocode
    );
    if (
      existingPromocode &&
      existingPromocode.promocodeFor == promocodeData.promocodeFor &&
      existingPromocode.isActive &&
      !existingPromocode.isDeleted
    ) {
      console.log("Error from create promocode, promocode name repeated");
      throw new Error("PROMOCODE_NAME_ALREADY_EXIST");
    }
    if (promocodeData.promocodeFor == "one-time") {
      const promocode = await promocodeUtils.savePromocode(promocodeData);
      return promocode;
    } else if (promocodeData.promocodeFor == "subscription") {
      if (promocodeData.plan && promocodeData.plan.length > 0) {
        for await (const planId of promocodeData.plan) {
          const plan = await productUtils.getProductById(planId);
          if (!plan) {
            console.log("product not found in crete promocode", { planId });
            throw new Error("NOT_FOUND");
          }
        }
      } else {
        promocodeData.plan = [];
      }

      const coupen = await stripeHelper.createCoupenInStripe(
        promocodeData.coupenName,
        promocodeData.currency,
        promocodeData.duration,
        promocodeData.durationInMonths,
        promocodeData.discountInAmount * 100,
        promocodeData.discountInPercentage,
        promocodeData.plan,
        promocodeData.maxRedumption
      );

      const promocode = await stripeHelper.createPromocodeInStripe(
        coupen.id,
        promocodeData.promocode,
        promocodeData.specificCustomer,
        promocodeData.maxRedumption,
        promocodeData.minAmount * 100,
        promocodeData.currency
      );
      const savedPromocode = await promocodeUtils.savePromocode({
        ...promocodeData,
        stripeCoupenId: coupen.id,
        stripePromocodeId: promocode.id,
      });
      return savedPromocode;
    } else {
      console.log("invalid promocode type");
      throw new Error("CONFLICT");
    }
  } catch (error) {
    console.log("Error from create promocode", { error });
    throw new Error(error.message);
  }
};

const getPromocodes = async (page, limit) => {
  try {
    const promocode = await promocodeUtils.getAllPromocode(page, limit);
    return promocode;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getActivePromocodeAccordingToPlan = async (type, data, page, limit) => {
  try {
    const promocode = await promocodeUtils.getActivePromocodeAccordingToPlan(
      type,
      data,
      page,
      limit
    );
    return promocode;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getPromocodeById = async (promocodeId) => {
  try {
    const promocode = await promocodeUtils.getPromocodeById(promocodeId);
    if (!promocode) {
      console.log("promocode not found");
      throw new Error("NOT_FOUND");
    }
    return promocode;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updatePromocode = async (promocodeData) => {
  try {
    const promocode = await promocodeUtils.getPromocodeById(
      promocodeData.promocodeId
    );
    if (promocodeData.coupenName == "") {
      const existingPromocode = await promocodeUtils.getPromocodeByName(
        promocodeData.coupenName
      );
      if (existingPromocode) {
        console.log("Error from create promocode, promocode name repeated");
        throw new Error("PROMOCODE_NAME_ALREADY_EXIST");
      }
      await stripeHelper.updatepromocodeInStripe(
        promocode.stripePromocodeId,
        promocodeData.isActive
      );
    } else {
      await stripeHelper.updateCoupenInStripe(
        promocode.stripeCoupenId,
        coupenName
      );
    }
    const updatedPromocode = await promocodeUtils.updatePromocodeById(
      promocode._id,
      {
        ...promocode,
        ...promocodeData,
      }
    );
    return updatedPromocode;
  } catch (error) {
    console.log("Error from update promocode", { error });
    throw new Error(error.message);
  }
};

const deletePromocode = async (promocodeId, data) => {
  try {
    const promocode = await promocodeUtils.getPromocodeById(promocodeId);

    if (promocode.promocodeFor == "subscription") {
      await stripeHelper.deleteCoupenInStripe(promocode.stripeCoupenId);

      const stripePaymentIds =
        await paymentUtils.getAllCistinctPaymentUsingStripePaymentId();

      if (data.wantToRemoveFromExistingSubscription) {
        for await (const id of stripePaymentIds) {
          if (id.split("_").includes("sub")) {
            const subscription =
              await stripeHelper.getSubscriptionBySubscriptionIdInStripe(id);
            if (
              subscription.status != "canceled" &&
              subscription.discount &&
              subscription.discount.promotion_code ==
                promocode.stripePromocodeId
            ) {
              console.log({ id });
              await stripeHelper.removePromocodeFromSubscriptionInStripe(id);
            }
          }
        }
      }
    }

    await promocodeUtils.updatePromocodeById(promocodeId, {
      ...promocode,
      isDeleted: true,
      isActive: false,
    });
    return;
  } catch (error) {
    console.log("Error from delete promocode", { error });
    throw new Error(error.message);
  }
};

export default {
  createPromocode,
  getPromocodes,
  getActivePromocodeAccordingToPlan,
  getPromocodeById,
  updatePromocode,
  deletePromocode,
};
