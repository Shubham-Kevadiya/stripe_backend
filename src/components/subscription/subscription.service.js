import stripeHelper from "../../helper/stripe.helper.js";
import userUtils from "../../utils/user.utils.js";
import purchaseUtils from "../../utils/purchase.utils.js";
import paymentUtils from "../../utils/payment.utils.js";
import common from "../../constants/common.js";

const createSubscription = async (subscriptionData) => {
  try {
    const user = await userUtils.getUserById(subscriptionData.userId);
    if (!user) {
      console.log("user not found in pause subscription");
      throw new Error("USER_NOT_FOUND");
    }
    const paymentMethods = user.paymentMethod.map((a) => {
      return a.id;
    });
    if (!paymentMethods.includes(subscriptionData.paymentMethodId)) {
      console.log("user has no payment method with this id");
      throw new Error("PAYMENT_METHOD_NOT_FOUND");
    }
    // let cancelAt;
    // if (subscriptionData.interval == "week") {
    //   cancelAt = new Date(new Date().setDate(new Date().getDate() + 7));
    // } else if (subscriptionData.interval == "month") {
    //   cancelAt = new Date(new Date().setMonth(new Date().getMonth() + 1));
    // } else if (subscriptionData.interval == "year") {
    //   cancelAt = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    // }

    const subscription = await stripeHelper.createSubscriptionInStripe(
      subscriptionData.paymentMethodId,
      user.customerId,
      subscriptionData.priceId,
      new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    );
    const payment = await paymentUtils.savePayment({
      userId: user._id,
      stripePaymentId: subscription.id,
      paymentType: common.PAYMENT_TYPE.SUBSCRIPTION,
      amount: subscriptionData.amount,
      paymentMethod: { id: subscriptionData.paymentMethodId, type: "card" },
      planId: subscriptionData.planId,
    });
    const purchase = await purchaseUtils.savePurchase({
      userId: user._id,
      planType: subscriptionData.planType,
      amount: subscriptionData.amount,
      interval: subscriptionData.interval,
      planId: subscriptionData.planId,
      paymentId: payment._id,
    });
    await stripeHelper.updateSubscriptionInStripe(subscription.id, {
      purchaseId: purchase._id.toString(),
      planType: subscriptionData.planType,
      amount: subscriptionData.amount,
      interval: subscriptionData.interval,
    });
    return subscription;
  } catch (error) {
    console.log("Error from create subscription service", { error });
    throw new Error(error.message);
  }
};

const updateSubscription = async (subscriptionData) => {
  try {
    const user = await userUtils.getUserById(subscriptionData.userId);
    if (!user) {
      console.log("user not found in pause subscription");
      throw new Error("USER_NOT_FOUND");
    }

    await stripeHelper.updatePaymentMethodOfSubscriptionInStripe(
      subscriptionData.subscriptionId,
      subscriptionData.paymentMethodId
    );

    return subscription;
  } catch (error) {
    console.log("Error from update subscription service", { error });
    throw new Error(error.message);
  }
};

const pauseSubscription = async (subscriptionData) => {
  try {
    const user = await userUtils.getUserById(subscriptionData.userId);
    if (!user) {
      console.log("user not found in pause subscription");
      throw new Error("USER_NOT_FOUND");
    }
    const existingPurchase = await purchaseUtils.getPurchaseById(
      subscriptionData.purchaseId
    );
    if (!existingPurchase) {
      console.log("purchase not found in pause subscription");
      throw new Error("RESOURCE_NOT_FOUND");
    }
    if (existingPurchase.isPaused) {
      console.log("You have already paused the plan");
      throw new Error("CONFLICT");
    }
    if (existingPurchase.planType == "One Time") {
      console.log("You have purchase One Time plan", { subscriptionData });
      throw new Error("BAD_CREDENTIALS");
    }
    const subscription = await stripeHelper.pauseSubscriptionInStripe(
      subscriptionData.stripeSubscriptionId
    );
    await purchaseUtils.updatePurchaseById({
      ...existingPurchase,
      purchaseId: subscriptionData.purchaseId,
      isPaused: true,
      planPauseDate: new Date(),
    });

    return subscription;
  } catch (error) {
    console.log("Error from pause subscription service", { error });
    throw new Error(error.message);
  }
};

const resumeSubscription = async (subscriptionData) => {
  try {
    const user = await userUtils.getUserById(subscriptionData.userId);
    if (!user) {
      console.log("user not found in resume subscription");
      throw new Error("USER_NOT_FOUND");
    }
    const existingPurchase = await purchaseUtils.getPurchaseById(
      subscriptionData.purchaseId
    );
    if (!existingPurchase) {
      console.log("purchase not found in resume subscription");
      throw new Error("RESOURCE_NOT_FOUND");
    }
    if (existingPurchase.planType == "One Time") {
      console.log("You have purchase One Time plan", { subscriptionData });
      throw new Error("BAD_CREDENTIALS");
    }

    const subscription = await stripeHelper.resumeSubscriptionInStripe(
      subscriptionData.subscriptionId
    );
    const resumeTime = new Date();

    await purchaseUtils.updatePurchaseById({
      ...existingPurchase,
      purchaseId: subscriptionData.purchaseId,
      planEndDate: new Date(
        existingPurchase.planEndDate.getTime() +
          (resumeTime.getTime() - existingPurchase.planPauseDate.getTime())
      ),
      nextPaymentDate: new Date(
        existingPurchase.nextPaymentDate.getTime() +
          (resumeTime.getTime() - existingPurchase.planPauseDate.getTime())
      ),
      isPaused: false,
      isResumed: true,
    });

    return subscription;
  } catch (error) {
    console.log("Error from resume subscription service", { error });
    throw new Error(error.message);
  }
};

const cancelSubscription = async (subscriptionData) => {
  try {
    const user = await userUtils.getUserById(subscriptionData.userId);
    if (!user) {
      console.log("user not found in pause subscription");
      throw new Error("USER_NOT_FOUND");
    }
    const existingPurchase = await purchaseUtils.getPurchaseById(
      subscriptionData.purchaseId
    );
    if (!existingPurchase) {
      console.log("purchase not found in pause subscription");
      throw new Error("RESOURCE_NOT_FOUND");
    }
    const subscription = await stripeHelper.cancelSubscriptionInStripe(
      subscriptionData.subscriptionId,
      subscriptionData.reason
    );
    await purchaseUtils.updatePurchaseById({
      ...existingPurchase,
      purchaseId: subscriptionData.purchaseId,
      isCanceled: true,
    });

    return subscription;
  } catch (error) {
    console.log("Error from cancel subscription service", { error });
    throw new Error(error.message);
  }
};

export default {
  createSubscription,
  updateSubscription,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
};
