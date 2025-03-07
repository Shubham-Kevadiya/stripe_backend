import purchaseUtils from "../../utils/purchase.utils.js";
import userUtils from "../../utils/user.utils.js";

const getAllFilteredPurchaseOfUser = async (data) => {
  let filterQuery = {};
  const user = await userUtils.getUserById(data.userId);
  if (!user) {
    console.log("user not found in get all filtered subscription");
    throw new Error("USER_NOT_FOUND");
  }
  if (data.isActive) {
    filterQuery.isCanceled = false;
    filterQuery.isFinished = false;
    filterQuery.paymentConfirmed = true;
  }
  if (data.paymentFailed) {
    filterQuery.paymentConfirmed = false;
  }
  if (data.type == "subscription") {
    filterQuery.planType = "subscription";
  }
  if (data.type == "one-time") {
    filterQuery.planType = "one-time";
  }
  const purchase = await purchaseUtils.getFilteredPurchaseOfUser({
    ...filterQuery,
    userId: user._id.toString(),
  });
  return purchase;
};

export default {
  getAllFilteredPurchaseOfUser,
};
