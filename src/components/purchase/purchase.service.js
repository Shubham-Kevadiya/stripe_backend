import purchaseUtils from "../../utils/purchase.utils.js";
import userUtils from "../../utils/user.utils.js";

const createPurchase = async (purchaseData) => {
  // params : {userId,planType,amount}
  try {
    const user = await userUtils.getUserById(purchaseData.userId);
    if (!user) {
      console.log("user not found in create purchase intent");
      throw new Error("USER_NOT_FOUND");
    }
    // const planStartDate = new Date();
    // const planEndDate = setFullYear(planStartDate.getFullYear() + 1);
    // if (purchaseData.interval) {
    //   let nextPaymentDate;
    //   if (interval == "week") {
    //     nextPaymentDate = planStartDate.setDate(planStartDate.getDate() + 7);
    //   } else if (interval == "month") {
    //     nextPaymentDate = planStartDate.setDate(planStartDate.getMonth() + 1);
    //   } else if (interval == "year") {
    //     nextPaymentDate = planStartDate.setDate(
    //       planStartDate.getFullYear() + 1
    //     );
    //   }
    // }
    const purchase = await purchaseUtils.savePurchase({
      userId: purchaseData.userId,
      planType: purchaseData.planType,
      amount: purchaseData.amount,
      interval: purchaseData.interval,
      // planStartDate,
      // planEndDate,
      // nextPaymentDate,
    });
    return purchase;
  } catch (error) {
    console.log("Error from create purchase service", { error });
    throw new Error(error.message);
  }
};

const updatePurchase = async (purchaseData) => {
  // params : {userId,purchaseId,isPaymentCompleted}
  try {
    const user = await userUtils.getUserById(purchaseData.userId);
    if (!user) {
      console.log("user not found in update purchase");
      throw new Error("USER_NOT_FOUND");
    }
    const existingPurchase = await purchaseUtils.getPurchaseById(
      purchaseData.purchaseId
    );
    if (!existingPurchase) {
      console.log("purchase not found in update purchase service");
      throw new Error("RESOURCE_NOT_FOUND");
    }
    if (existingPurchase.userId != user._id) {
      console.log("user id is not matched with purchase object");
      throw new Error("UNAUTHORIZE");
    }
    let planStartDate, planEndDate, nextPaymentDate;
    if (purchaseData.isPaymentCompleted) {
      planStartDate = new Date();
      planEndDate = setFullYear(planStartDate.getFullYear() + 1);
      if (purchaseData.interval) {
        if (interval == "week") {
          nextPaymentDate = planStartDate.setDate(planStartDate.getDate() + 7);
        } else if (interval == "month") {
          nextPaymentDate = planStartDate.setDate(planStartDate.getMonth() + 1);
        } else if (interval == "year") {
          nextPaymentDate = planStartDate.setDate(
            planStartDate.getFullYear() + 1
          );
        }
      }
    }
    const updatedPurchase = await purchaseUtils.updatePurchaseById({
      purchaseId: purchaseData.purchaseId,
      ...existingPurchase,
      ...purchaseData,
      planStartDate: purchaseData.isPaymentCompleted
        ? planStartDate
        : existingPurchase.planStartDate,
      planEndDate: purchaseData.isPaymentCompleted
        ? planEndDate
        : existingPurchase.planEndDate,
      nextPaymentDate: purchaseData.isPaymentCompleted
        ? nextPaymentDate
        : existingPurchase.nextPaymentDate,
    });
    return updatedPurchase;
  } catch (error) {
    console.log("Error from update purchase service", { error });
    throw new Error(error.message);
  }
};

export default {
  createPurchase,
  updatePurchase,
};
