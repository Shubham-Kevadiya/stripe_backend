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
      throw new Error("RESOURCE_NOT_FOUND");
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
      throw new Error("RESOURCE_NOT_FOUND");
    }
    if (paymentMethod.card.country != "IN") {
      paymentData.description = "IT Service Intent";
    }
    const paymentIntent = await stripeHelper.createPaymentIntentInStripe({
      amount: paymentData.amount * 100,
      currency: plan.currency,
      // isAutoPaymentSetup: paymentData.isAutoPaymentSetup,
      customerId: user.customerId,
      paymentMethod: paymentData.paymentMethod.id,
      description: paymentData.description ? paymentData.description : "",
      // paymentMethodType: "card",
    });
    const payment = await paymentUtils.savePayment(
      new PaymentModel({
        userId: user._id,
        stripePaymentId: paymentIntent.id,
        paymentType: common.PAYMENT_TYPE.INTENT,
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        clientSecret: paymentIntent.client_secret,
        planId: plan._id,
      })
    );
    const purchase = await purchaseUtils.savePurchase({
      userId: user._id,
      planType: paymentData.planType,
      amount: paymentData.amount,
      interval: paymentData.interval,
      planId: plan._id,
    });
    await stripeHelper.updatePaymentIntentInStripe(paymentIntent.id, {
      purchaseId: purchase._id.toString(),
    });
    return payment;
  } catch (error) {
    console.log("Error from create payment intent", { error });

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
