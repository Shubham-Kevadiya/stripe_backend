import common from '../../constants/common.js';
import promocodeHelper from '../../helper/promocode.helper.js';
import stripeHelper from '../../helper/stripe.helper.js';
import paymentUtils from '../../utils/payment.utils.js';
import productUtils from '../../utils/product.utils.js';
import promocodeUtils from '../../utils/promocode.utils.js';
import purchaseUtils from '../../utils/purchase.utils.js';
import userUtils from '../../utils/user.utils.js';

const createPaymentIntent = async (paymentData) => {
  try {
    const user = await userUtils.getUserById(paymentData.userId);
    if (!user) {
      console.log('user not found in create payment intent');
      throw new Error('USER_NOT_FOUND');
    }
    const paymentMethods = user.paymentMethod.map((paymentMethod) => {
      return paymentMethod.id;
    });

    if (!paymentMethods.includes(paymentData.paymentMethod.id)) {
      console.log('user has no payment method with this id');
      throw new Error('CARD_NOT_OWNED_BY_USER');
    }
    const plan = await productUtils.getProductById(paymentData.planId);
    if (!plan) {
      console.log('plan not found in create payment intent');
      throw new Error('RESOURCE_NOT_FOUND');
    }
    const paymentMethod = await stripeHelper.getPaymentMethodInStripe(
      paymentData.paymentMethod.id
    );
    if (!paymentMethod) {
      console.log(
        'payment method not found in stripe in create payment intent'
      );
      throw new Error('PAYMENT_METHOD_NOT_FOUND');
    }
    const promocode = await promocodeUtils.getPromocodeById(
      paymentData.promocodeId
    );

    if (!promocode) {
      console.log('Promocode not found in create subscription', {
        promocodeId: paymentData.stripePromocodeId,
      });
      throw new Error('NOT_FOUND');
    }
    if (promocode.promocodeFor != 'one-time') {
      console.log(`Invalid promocode for ${promocode.promocodeFor}`, {
        promocodeId: promocode._id,
      });
      throw new Error('CONFLICT');
    }

    let amount;
    if (promocode.discountInAmount) {
      amount = paymentData.amount - promocode.discountInAmount;
    } else if (promocode.discountInPercentage) {
      amount =
        paymentData.amount -
        Math.round((paymentData.amount * promocode.discountInPercentage) / 100);
    }

    await promocodeHelper.isPromocodeAvailableToUse(promocode, paymentData);

    const paymentIntent = await stripeHelper.createPaymentIntentInStripe({
      amount: (amount == 0 ? amount + 0.5 : amount) * 100,
      currency: plan.currency,
      customerId: user.customerId,
      paymentMethod: paymentData.paymentMethod.id,
      description: (paymentData.description = 'IT Service Intent'),
    });

    let payment;
    if (
      promocode.discountInAmount == paymentData.amount ||
      promocode.discountInPercentage == 100
    ) {
      payment = await paymentUtils.savePayment({
        userId: user._id,
        stripePaymentId: paymentIntent.id,
        paymentType: common.PAYMENT_TYPE.INTENT,
        amount: amount,
        paymentMethod: paymentData.paymentMethod,
        planId: paymentData.planId,
        startDate: new Date().toISOString(),
        endDate: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ).toISOString(),
        status: 'Completed',
        promocodeId: promocode._id,
      });

      user.usedPromocodes.push(promocode._id);
      await userUtils.updateUserById({ ...user, userId: user._id });
    }

    const purchase = await purchaseUtils.savePurchase({
      userId: user._id,
      planType: common.PLAN_TYPE.ONE_TIME,
      amount: paymentData.amount,
      interval: common.INTERVAL.YEAR,
      planId: plan._id,
      transactionHistory: payment ? payment : [],
    });

    await stripeHelper.updatePaymentIntentInStripe(paymentIntent.id, {
      purchaseId: purchase._id.toString(),
      promocodeId: paymentData.promocodeId.toString(),
      paymentId: payment ? payment._id : '',
    });
    return paymentIntent;
  } catch (error) {
    console.log('Error from create payment intent', {
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
      console.log('user not found in confirm payment intent');
      throw new Error('USER_NOT_FOUND');
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
