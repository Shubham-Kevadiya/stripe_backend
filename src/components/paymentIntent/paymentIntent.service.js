import stripeHelper from "../../helper/stripe.helper.js";
import userUtils from "../../utils/user.utils.js";
import paymentUtils from "../../utils/payment.utils.js";
import { PaymentModel } from "../../model/payment.model.js";

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
    const currency = paymentData.products[0].currency;
    let amount = 0;
    let productId = [];
    paymentData.products.forEach((product) => {
      amount = amount + product.price;
      productId.push({
        productId: product._id,
        stripeProductId: product.productId,
      });
    });
    const paymentIntent = await stripeHelper.createPaymentIntentInStripe({
      amount: amount * 100,
      currency: currency,
      isAutoPaymentSetup: paymentData.isAutoPaymentSetup,
      customerId: user.customerId,
      paymentMethod: paymentData.paymentMethod.id,
      paymentMethodType: "card",
    });
    const payment = await paymentUtils.savePayment(
      new PaymentModel({
        userId: user._id,
        stripePaymentId: paymentIntent.id,
        paymentType: "Intent",
        amount: amount,
        paymentMethod: paymentData.paymentMethod,
        clientSecret: paymentIntent.client_secret,
      })
    );
    return payment;
  } catch (error) {
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
