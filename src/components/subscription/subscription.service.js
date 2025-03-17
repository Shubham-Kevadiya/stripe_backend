import common from '../../constants/common.js';
import stripeHelper from '../../helper/stripe.helper.js';
import paymentUtils from '../../utils/payment.utils.js';
import promocodeUtils from '../../utils/promocode.utils.js';
import purchaseUtils from '../../utils/purchase.utils.js';
import userUtils from '../../utils/user.utils.js';

const createSubscription = async (subscriptionData) => {
  try {
    const user = await userUtils.getUserById(subscriptionData.userId);
    if (!user) {
      console.log('user not found in pause subscription');
      throw new Error('USER_NOT_FOUND');
    }

    const paymentMethods = user.paymentMethod.map((paymentMethod) => {
      return paymentMethod.id;
    });
    if (!paymentMethods.includes(subscriptionData.paymentMethodId)) {
      console.log('user has no payment method with this id');
      throw new Error('PAYMENT_METHOD_NOT_FOUND');
    }

    const promocode = await promocodeUtils.getPromocodeById(
      subscriptionData.promocodeId
    );

    if (!promocode) {
      console.log('Promocode not found in create subscription', {
        promocodeId: subscriptionData.stripePromocodeId,
      });
      throw new Error('NOT_FOUND');
    }

    if (!promocode.isActive || promocode.isDeleted) {
      console.log('currently promocode is not available');
      throw new Error('CONFLICT');
    }

    if (promocode.promocodeFor != 'subscription') {
      console.log(`Invalid promocode for ${promocode.promocodeFor}`, {
        promocodeId: promocode._id,
      });
      throw new Error('CONFLICT');
    }

    const subscription = await stripeHelper.createSubscriptionInStripe(
      subscriptionData.paymentMethodId,
      user.customerId,
      subscriptionData.priceId,
      new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      promocode.stripePromocodeId
    );

    const startDate = new Date();
    const endDate = new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    );

    let payment;
    if (
      promocode.discountInAmount == subscriptionData.amount ||
      promocode.discountInPercentage == 100
    ) {
      let nextPaymentDate;
      switch (subscriptionData.interval) {
        case 'week':
          nextPaymentDate = new Date(
            new Date(new Date()).setDate(new Date(new Date()).getDate() + 7)
          );
          break;
        case 'month':
          nextPaymentDate = new Date(
            new Date(new Date()).setMonth(new Date(new Date()).getMonth() + 1)
          );
          break;
        case 'year':
          nextPaymentDate = new Date(
            new Date(new Date()).setFullYear(
              new Date(new Date()).getFullYear() + 1
            )
          );
          break;
        default:
          break;
      }
      const paymentMethod = {
        id: subscriptionData.paymentMethodId,
        type: 'card',
      };
      payment = await paymentUtils.savePayment({
        userId: user._id,
        stripePaymentId: subscription.id,
        paymentType: common.PAYMENT_TYPE.SUBSCRIPTION,
        amount: subscriptionData.amount,
        paymentMethod,
        planId: subscriptionData.planId,
        startDate: startDate.toISOString(),
        endDate: nextPaymentDate.toISOString(),
        nextPaymentDate: nextPaymentDate.toISOString(),
        status: 'Completed',
        promocodeId: promocode._id,
      });
    }

    user.usedPromocodes.push(promocode._id);
    await userUtils.updateUserById({ ...user, userId: user._id });

    const purchase = await purchaseUtils.savePurchase({
      userId: user._id,
      planType: subscriptionData.planType,
      amount: subscriptionData.amount,
      interval: subscriptionData.interval,
      planId: subscriptionData.planId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      transactionHistory: payment ? payment : [],
    });

    await stripeHelper.updateSubscriptionInStripe(subscription.id, {
      purchaseId: purchase._id.toString(),
      planType: subscriptionData.planType,
      amount: subscriptionData.amount,
      interval: subscriptionData.interval,
      userId: user._id.toString(),
      paymentType: common.PAYMENT_TYPE.SUBSCRIPTION,
      planId: subscriptionData.planId,
      promocodeId: promocode._id.toString(),
    });
    return subscription;
  } catch (error) {
    console.log('Error from create subscription service', { error });
    throw new Error(error.message);
  }
};

const updateSubscription = async (subscriptionData) => {
  try {
    const user = await userUtils.getUserById(subscriptionData.userId);
    if (!user) {
      console.log('user not found in pause subscription');
      throw new Error('USER_NOT_FOUND');
    }

    await stripeHelper.updatePaymentMethodOfSubscriptionInStripe(
      subscriptionData.subscriptionId,
      subscriptionData.paymentMethodId
    );

    return 'subscription updated successfully';
  } catch (error) {
    console.log('Error from update subscription service', { error });
    throw new Error(error.message);
  }
};

const pauseSubscription = async (subscriptionData) => {
  try {
    const user = await userUtils.getUserById(subscriptionData.userId);
    if (!user) {
      console.log('user not found in pause subscription');
      throw new Error('USER_NOT_FOUND');
    }
    const existingPurchase = await purchaseUtils.getPurchaseById(
      subscriptionData.purchaseId
    );
    if (!existingPurchase) {
      console.log('purchase not found in pause subscription');
      throw new Error('RESOURCE_NOT_FOUND');
    }
    // if (existingPurchase.isPaused) {
    //   console.log("You have already paused the plan");
    //   throw new Error("CONFLICT");
    // }
    if (existingPurchase.planType == 'One Time') {
      console.log('You have purchase One Time plan', { subscriptionData });
      throw new Error('BAD_CREDENTIALS');
    }

    const subscription =
      await stripeHelper.getSubscriptionBySubscriptionIdInStripe(
        subscriptionData.subscriptionId
      );

    await stripeHelper.resetSubscriptionTimeInStripe(subscription.id);

    await stripeHelper.pauseSubscriptionInStripe(
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
    console.log('Error from pause subscription service', { error });
    throw new Error(error.message);
  }
};

const resumeSubscription = async (subscriptionData) => {
  try {
    const user = await userUtils.getUserById(subscriptionData.userId);
    if (!user) {
      console.log('user not found in resume subscription');
      throw new Error('USER_NOT_FOUND');
    }
    const existingPurchase = await purchaseUtils.getPurchaseById(
      subscriptionData.purchaseId
    );
    if (!existingPurchase) {
      console.log('purchase not found in resume subscription');
      throw new Error('RESOURCE_NOT_FOUND');
    }
    if (existingPurchase.planType == 'One Time') {
      console.log('You have purchase One Time plan', { subscriptionData });
      throw new Error('BAD_CREDENTIALS');
    }

    const subscription =
      await stripeHelper.getSubscriptionBySubscriptionIdInStripe(
        subscriptionData.subscriptionId
      );

    // const latestInvoice = await stripeHelper.getInvoiceByIdFromStripe(
    //   subscription.latest_invoice
    // );

    // let invoiceToPay;
    // if (latestInvoice.status == "draft") {
    //   invoiceToPay = await stripeHelper.payInvoiceInStripe(latestInvoice.id);
    // }

    // await stripeHelper.setAutoCollectionOfInvoiceInStripe(
    //   subscription.latest_invoice
    // );

    await stripeHelper.resumeSubscriptionInStripe(
      subscriptionData.subscriptionId
    );

    const resetSubscription = await stripeHelper.resetSubscriptionTimeInStripe(
      subscription.id
    );

    const latestInvoice = await stripeHelper.getInvoiceByIdFromStripe(
      resetSubscription.latest_invoice
    );

    const invoiceToPay = await stripeHelper.payInvoiceInStripe(
      latestInvoice.id
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

    return invoiceToPay ? invoiceToPay.hosted_invoice_url : '';
  } catch (error) {
    console.log('Error from resume subscription service', { error });
    throw new Error(error.message);
  }
};

const cancelSubscription = async (subscriptionData) => {
  try {
    const user = await userUtils.getUserById(subscriptionData.userId);
    if (!user) {
      console.log('user not found in pause subscription');
      throw new Error('USER_NOT_FOUND');
    }
    const existingPurchase = await purchaseUtils.getPurchaseById(
      subscriptionData.purchaseId
    );
    if (!existingPurchase) {
      console.log('purchase not found in pause subscription');
      throw new Error('RESOURCE_NOT_FOUND');
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
    console.log('Error from cancel subscription service', { error });
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
