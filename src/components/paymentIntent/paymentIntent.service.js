import stripeHelper from "../../helper/stripe.helper.js";
import userUtils from "../../utils/user.utils.js";
import paymentUtils from "../../utils/payment.utils.js";
import { PaymentModel } from "../../model/payment.model.js";
import common from "../../constants/common.js";
import purchaseUtils from "../../utils/purchase.utils.js";
import productUtils from "../../utils/product.utils.js";

const createPaymentIntent = async (paymentData) => {
  try {
    const user = await userUtils.getUserById(paymentData.userId);
    if (!user) {
      console.log("user not found in create payment intent");
      throw new Error("USER_NOT_FOUND");
    }
    const paymentMethods = user.paymentMethod.map((a) => {
      return a.id;
    });

    if (!paymentMethods.includes(paymentData.paymentMethod.id)) {
      console.log("user has no payment method with this id");
      throw new Error("CARD_NOT_OWNED_BY_USER");
    }
    const plan = await productUtils.getProductById(paymentData.planId);
    if (!plan) {
      console.log("plan not found in create payment intent");
      throw new Error("RESOURCE_NOT_FOUND");
    }
    const paymentMethod = await stripeHelper.getPaymentMethodInStripe(
      paymentData.paymentMethod.id
    );
    if (!paymentMethod) {
      console.log(
        "payment method not found in stripe in create payment intent"
      );
      throw new Error("PAYMENT_METHOD_NOT_FOUND");
    }
    const paymentIntent = await stripeHelper.createPaymentIntentInStripe({
      amount: paymentData.amount * 100,
      currency: plan.currency,
      customerId: user.customerId,
      paymentMethod: paymentData.paymentMethod.id,
      description: (paymentData.description = "IT Service Intent"),
    });

    const purchase = await purchaseUtils.savePurchase({
      userId: user._id,
      planType: common.PLAN_TYPE.ONE_TIME,
      amount: paymentData.amount,
      interval: common.INTERVAL.YEAR,
      planId: plan._id,
    });
    await stripeHelper.updatePaymentIntentInStripe(paymentIntent.id, {
      purchaseId: purchase._id.toString(),
    });
    return payment;
  } catch (error) {
    console.log("Error from create payment intent", {
      code: error.statusCode,
      message: error.message,
    });
    throw new Error(error.message);
  }
};

const confirmPaymentIntent = async (paymentData) => {
  try {
    const user = await userUtils.getUserById(paymentData.userId);
    if (!user) {
      console.log("user not found in confirm payment intent");
      throw new Error("USER_NOT_FOUND");
    }
    const paymentIntent = await stripeHelper.confirmPaymentIntentInStripe({
      paymentIntentId: paymentData.paymentIntentId,
      paymentMethod: paymentData.paymentMethod,
    });
    return paymentIntent;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
  createPaymentIntent,
  confirmPaymentIntent,
};
