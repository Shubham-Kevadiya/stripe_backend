import userUtils from "../../utils/user.utils.js";
import stripeHelper from "../../helper/stripe.helper.js";
import common from "../../constants/common.js";
import purchaseUtils from "../../utils/purchase.utils.js";

const createPaymentMethod = async (paymentMethodData, userId) => {
  try {
    const user = await userUtils.getUserById(userId);
    if (!user) {
      console.log("user not found in create payment method");
      throw new Error("USER_NOT_FOUND");
    }

    // const token = await stripeHelper.createTokenForPaymenthodInStripe(
    //   paymentMethodData.cardData
    // );

    // delete paymentMethodData.cardData;
    const token = paymentMethodData.token;
    delete paymentMethodData.token;
    const paymentMethod = await stripeHelper.createPaymentMethodInStripe(
      paymentMethodData,
      token
    );
    await stripeHelper.attachCustomerToPaymentMethodInStripe(
      paymentMethod.id,
      user.customerId
    );
    if (user.defaultPaymentMethod.id == "" && user.paymentMethod.length == 0) {
      await stripeHelper.setDefaultPaymenteMethodToCustomerInStripe(
        user.customerId,
        paymentMethod.id
      );
      user.defaultPaymentMethod = {
        id: paymentMethod.id,
        type: common.TYPE,
      };
    }

    user.paymentMethod.push({
      id: paymentMethod.id,
      type: common.TYPE,
    });
    const updatedUser = await userUtils.updateUserById({
      userId,
      ...user,
      address: paymentMethodData.address,
    });
    return updatedUser;
  } catch (error) {
    console.log("Error from create payment Method", { error });
    // throw new Error(
    //   common.STRIPE_ERROR_CODES[error.code]
    //     ? common.STRIPE_ERROR_CODES[error.code].error
    //     : error.message
    // );
    throw new Error(error.message);
  }
};

const getPaymentMethodOfUser = async (userId, paymentMethodId, limit) => {
  try {
    const user = await userUtils.getUserById(userId);
    if (!user) {
      console.log("user not found in create payment method");
      throw new Error("CARD_NOT_OWNED_BY_USER");
    }
    // if (user.defaultPaymentMethod && user.defaultPaymentMethod.id != "") {
    //   user.paymentMethod.splice(
    //     user.paymentMethod.findIndex(
    //       (a) => a.id === user.defaultPaymentMethod.id
    //     ),
    //     1
    //   );
    //   user.paymentMethod.unshift(user.defaultPaymentMethod);
    // }
    // return {
    //   paymentMethod: user.paymentMethod.slice((page - 1) * limit, page * limit),
    //   isDafaultSet:
    //     user.defaultPaymentMethod && user.defaultPaymentMethod.id != ""
    //       ? true
    //       : false,
    // };

    const paymentMethodOfUser =
      await stripeHelper.getPaymentMethodOfUserFromStripe(
        user.customerId,
        limit
      );
    return paymentMethodOfUser;
  } catch (error) {
    console.log("Error from get payment Method of user");
    throw new Error(error.message);
  }
};

const getPaymentMethodByPaymentMethodId = async (userId, paymentMethodId) => {
  try {
    const user = await userUtils.getUserById(userId);
    if (!user) {
      console.log("user not found in create payment method");
      throw new Error("USER_NOT_FOUND");
    }
    const paymentMethods = user.paymentMethod.map((a) => {
      return a.id;
    });
    if (!paymentMethods.includes(paymentMethodId)) {
      console.log("user has no payment method with this id");
      throw new Error("CARD_NOT_OWNED_BY_USER");
    }
    const paymentMethod = await stripeHelper.getPaymentMethodInStripe(
      paymentMethodId
    );
    return paymentMethod;
  } catch (error) {
    console.log("Error from get payment Method By payment method id");
    // throw new Error(error.message);
  }
};

const updatePaymentMethodOfUser = async (
  paymentMethodData,
  paymentMethodId,
  userId
) => {
  try {
    const user = await userUtils.getUserById(userId);
    if (!user) {
      console.log("user not found in create payment method");
      throw new Error("USER_NOT_FOUND");
    }
    const paymentMethods = user.paymentMethod.map((a) => {
      return a.id;
    });
    if (!paymentMethods.includes(paymentMethodId)) {
      console.log("user has no payment method with this id");
      throw new Error("CARD_NOT_OWNED_BY_USER");
    }
    const updatedPaymentMethod = await stripeHelper.updatePaymentMethodInStripe(
      paymentMethodData,
      paymentMethodId
    );
    return updatedPaymentMethod;
  } catch (error) {
    console.log("Error from update payment Method of user");
    // throw new Error(error.message);
  }
};

const deletePaymentMethodByPaymentMethodId = async (
  userId,
  paymentMethodId
) => {
  try {
    const user = await userUtils.getUserById(userId);
    if (!user) {
      console.log("user not found in create payment method");
      throw new Error("USER_NOT_FOUND");
    }
    // const paymentMethods = user.paymentMethod.map((a) => {
    //   return a.id;
    // });
    // if (!paymentMethods.includes(paymentMethodId)) {
    //   console.log("user has no payment method with this id");
    //   throw new Error("CARD_NOT_OWNED_BY_USER");
    // }
    // const isPaymentMethodUsedInActiveSubscription =
    //   await purchaseUtils.getPurchaseByPaymentMethod({
    //     paymentMethod: {
    //       id: paymentMethodId,
    //       type: "card",
    //     },
    //     isCanceled: false,
    //     isFinished: false,
    //     paymentConfirmed: true,
    //     planType: "subscription",
    //   });
    // if (isPaymentMethodUsedInActiveSubscription) {
    //   throw new Error("CARD_USED_IN_ACTIVE_SUBSCRIPTION");
    // }

    // const customer = await stripeHelper.getCustomerFromStripe(user.customerId);
    // if (!customer) {
    //   console.log("Customer not found in delete payment method");
    //   throw new Error("BAD_CREDENTIALS");
    // }
    // if (customer.invoice_settings.default_payment_method == paymentMethodId) {
    //   console.log("provided payment method is user's default payment method");
    //   throw new Error("BAD_CREDENTIALS");
    // }
    // await stripeHelper.setDefaultPaymenteMethodToCustomerInStripe(
    //   user.customerId,
    //   ""
    // );
    await stripeHelper.detachPaymentMethodInStripe(paymentMethodId);

    user.paymentMethod.splice(
      user.paymentMethod.findIndex((a) => a.id === paymentMethodId),
      1
    );
    if (user.defaultPaymentMethod.id == paymentMethodId) {
      user.defaultPaymentMethod = {
        id: "",
        type: "",
      };
    }
    await userUtils.updateUserById({ ...user, userId: user._id });
    return { msg: "Payment Method deleted successfully" };
  } catch (error) {
    console.log("Error from delete payment Method By payment method id");
    throw new Error(error.message);
  }
};

const setDefaultPaymentMethod = async (userId, paymentMethodId) => {
  try {
    const user = await userUtils.getUserById(userId);
    if (!user) {
      console.log("user not found in create payment method");
      throw new Error("USER_NOT_FOUND");
    }
    const paymentMethods = user.paymentMethod.map((a) => {
      return a.id;
    });
    if (!paymentMethods.includes(paymentMethodId)) {
      console.log("user has no payment method with this id");
      throw new Error("CARD_NOT_OWNED_BY_USER");
    }
    user.defaultPaymentMethod =
      user.paymentMethod[
        user.paymentMethod.findIndex((a) => a.id === paymentMethodId)
      ];
    await stripeHelper.setDefaultPaymenteMethodToCustomerInStripe(
      user.customerId,
      paymentMethodId
    );
    await userUtils.updateUserById({ ...user, userId: user._id });
    return user;
  } catch (error) {
    console.log("Error from set default payment Method ");
    throw new Error(error.message);
  }
};

export default {
  createPaymentMethod,
  getPaymentMethodOfUser,
  getPaymentMethodByPaymentMethodId,
  updatePaymentMethodOfUser,
  deletePaymentMethodByPaymentMethodId,
  setDefaultPaymentMethod,
};
