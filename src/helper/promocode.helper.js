import promocodeUtils from '../utils/promocode.utils.js';
import userUtils from '../utils/user.utils.js';

const isPromocodeAvailableToUse = async (promocode, paymentData) => {
  try {
    const user = await userUtils.getUserById(paymentData.userId);
    if (!user) {
      console.log('user not found');
      throw new Error('USER_NOT_FOUND');
    }

    if (!promocode.isActive || promocode.isDeleted) {
      console.log('currently promocode is not available');
      throw new Error('PROMOCODE_NOT_AVAILABLE');
    }

    if (promocode.usedCount >= promocode.maxRedumption) {
      await promocodeUtils.updatePromocodeById(promocode._id, {
        ...promocode,
        isActive: false,
      });
      console.log('Promocode limit exceeded');
      throw new Error('PROMOCODE_LIMIT_EXCEEDED');
    }

    if (promocode.maxRedumption - promocode.usedCount == 0) {
      await promocodeUtils.updatePromocodeById(promocode._id, {
        ...promocode,
        isActive: false,
      });
    }

    if (promocode.minAmount > paymentData.amount) {
      console.log(
        `Amount should be greater or equal to ${promocode.minAmount}`
      );
      throw new Error('AMOUNT_NOT_MATCHED');
    }

    if (promocode.isFirstTimeOnly || promocode.duration == 'once') {
      const usedPromocodesOfUser = [];
      user.usedPromocodes.forEach((usedPromocode) => {
        usedPromocodesOfUser.push(usedPromocode.toString());
      });
      if (usedPromocodesOfUser.includes(promocode._id.toString())) {
        console.log(`user ${user.name} already used this promocode`, {
          userId: user._id,
        });
        throw new Error('PROMOCODE_ALREADY_USED');
      }
    }

    if (promocode.duration == 'repeating') {
      let count = 0;
      user.usedPromocodes.forEach((usedPromocode) => {
        if (usedPromocode.toString() == usedPromocode._id.toString()) {
          count = count + 1;
        }
      });
      if (count >= promocode.durationInMonths) {
        console.log(
          `user ${user.name} alrady used ${promocode.coupenName} ${count} times`
        );
        throw new Error('PROMOCODE_ALREADY_USED');
      }
    }
    if (
      promocode.plan.length > 0 &&
      !promocode.plan.includes(paymentData.planId)
    ) {
      console.log(`You can not use this promocode for this plan`);
      throw new Error('PROMOCODE_IS_NOT_AVAILABLE_FOR_THIS_PLAN');
    }

    if (
      promocode.specificCustomer &&
      promocode.specificCustomer != '' &&
      promocode.specificCustomer != user._id
    ) {
      console.log(`You can not use this promocode`);
      throw new Error('PROMOCODE_NOT_AVAILABLE');
    }

    if (promocode.currency != paymentData.currency) {
      console.log('Currency mismatch');
      throw new Error('CURRENCY_MISMATCHED');
    }
    return 'valid credentials';
  } catch (error) {
    console.log({ error });
    throw new Error(error);
  }
};

export default {
  isPromocodeAvailableToUse,
};
