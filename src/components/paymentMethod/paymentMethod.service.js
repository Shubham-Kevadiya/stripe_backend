import userUtils from "../../utils/user.utils.js";
import stripeHelper from "../../helper/stripe.helper.js";
import common from "../../constants/common.js";

const createPaymentMethod = async (paymentMethodData, userId) => {
  try {
    const user = await userUtils.getUserById(userId);
    if (!user) {
      console.log("user not found in create payment method");
      throw new Error("USER_NOT_FOUND");
    }
    const paymentMethod = await stripeHelper.createPaymentMethodInStripe(
      paymentMethodData
    );
    await stripeHelper.attachCustomerToPaymentMethodInStripe(
      paymentMethod.id,
      user.customerId
    );
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
    console.log("Error from create payment Method");
    throw new Error(error.message);
  }
};

const getPaymentMethodOfUser = async (userId, page, limit) => {
  try {
    const user = await userUtils.getUserById(userId);
    if (!user) {
      console.log("user not found in create payment method");
      throw new Error("USER_NOT_FOUND");
    }
    if (user.defaultPaymentMethod && user.defaultPaymentMethod.id != "") {
      user.paymentMethod.splice(
        user.paymentMethod.findIndex(
          (a) => a.id === user.defaultPaymentMethod.id
        ),
        1
      );
      user.paymentMethod.unshift(user.defaultPaymentMethod);
    }
    return {
      paymentMethod: user.paymentMethod.slice((page - 1) * limit, page * limit),
      isDafaultSet:
        user.defaultPaymentMethod && user.defaultPaymentMethod.id != ""
          ? true
          : false,
    };
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
      throw new Error("RESOURCE_NOT_FOUND");
    }
    const paymentMethod = await stripeHelper.getPaymentMethodInStripe(
      paymentMethodId
    );
    return paymentMethod;
  } catch (error) {
    console.log("Error from get payment Method By payment method id");
    throw new Error(error.message);
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
      throw new Error("RESOURCE_NOT_FOUND");
    }
    const updatedPaymentMethod = await stripeHelper.updatePaymentMethodInStripe(
      paymentMethodData,
      paymentMethodId
    );
    return updatedPaymentMethod;
  } catch (error) {
    console.log("Error from update payment Method of user");
    throw new Error(error.message);
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
    const paymentMethods = user.paymentMethod.map((a) => {
      return a.id;
    });
    if (!paymentMethods.includes(paymentMethodId)) {
      console.log("user has no payment method with this id");
      throw new Error("RESOURCE_NOT_FOUND");
    }
    await stripeHelper.detachPaymentMethodInStripe(paymentMethodId);
    return { msg: "Payment Method deleted successfully" };
  } catch (error) {
    console.log("Error from gdeleteet payment Method By payment method id");
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
      throw new Error("RESOURCE_NOT_FOUND");
    }
    user.defaultPaymentMethod =
      user.paymentMethod[
        user.paymentMethod.findIndex((a) => a.id === paymentMethodId)
      ];
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
