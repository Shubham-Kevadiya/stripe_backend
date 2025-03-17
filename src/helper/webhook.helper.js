import common from '../constants/common.js';
import paymentUtils from '../utils/payment.utils.js';
import promocodeUtils from '../utils/promocode.utils.js';
import purchaseUtils from '../utils/purchase.utils.js';
import userUtils from '../utils/user.utils.js';
import stripeHelper from './stripe.helper.js';

const paymentIntentSuccessHelper = async (paymentIntentId) => {
  try {
    const paymentIntentObj =
      await stripeHelper.getPaymentIntentFromStripe(paymentIntentId);
    if (
      paymentIntentObj.description &&
      !paymentIntentObj.description.split('').includes('Intent') &&
      paymentIntentObj.invoice
    ) {
      await paymentIntentSuceessHelperForSubscription(paymentIntentObj);
      return;
    }

    const user = await userUtils.getUserByStripeCustomerId(
      paymentIntentObj.customer
    );
    if (!user) {
      console.log(`user not found ,log from payment_intent.succeeded`, {
        customer: paymentIntentObj.customer,
      });
    }

    const purchase = await purchaseUtils.getPurchaseById(
      paymentIntentObj.metadata.purchaseId
    );
    if (!purchase) {
      console.log(`purchase not found, log from payment_intent.succeeded`, {
        paymentId: payment._id.toString(),
        userId: user._id.toString(),
      });
    }

    const promocode = await promocodeUtils.getPromocodeById(
      paymentIntentObj.metadata.promocodeId
    );

    await promocodeUtils.updatePromocodeById(promocode._id, {
      ...promocode,
      usedCount: promocode.usedCount + 1,
    });

    const payment = await paymentUtils.savePayment({
      userId: user._id,
      stripePaymentId: paymentIntentObj.id,
      paymentType: common.PAYMENT_TYPE.INTENT,
      amount: paymentIntentObj.amount,
      paymentMethod: { id: paymentIntentObj.payment_method },
      clientSecret: paymentIntentObj.client_secret,
      planId: purchase.planId,
      stripeChargeId: paymentIntentObj.latest_charge,
      startDate: new Date().toISOString(),
      endDate: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toISOString(),
      nextPaymentDate: 'N/A',
      status: 'Completed',
      promocodeId: promocode._id,
    });

    purchase.transactionHistory.push(payment._id);
    await purchaseUtils.updatePurchaseById({
      ...purchase,
      purchaseId: purchase._id,
      paymentId: payment._id,
      planStartDate: new Date().toISOString(),
      planEndDate: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toISOString(),
      paymentConfirmed: true,
      paymentMethod: payment.paymentMethod,
    });

    if (paymentIntentObj.metadata.paymentId != '') {
      user.usedPromocodes.push(promocode._id);
      await userUtils.updateUserById({ ...user, userId: user._id });
    }
  } catch (error) {
    console.log('Error log from payment_intent.succeeded', { error });
  }
};

const paymentIntentFailHelper = async (paymentIntentObj) => {
  try {
    if (
      paymentIntentObj.description &&
      !paymentIntentObj.description.split('').includes('Intent') &&
      paymentIntentObj.invoice
    ) {
      await paymentIntentFailHelperForSubscription(paymentIntentObj);
      return;
    }

    const user = await userUtils.getUserByStripeCustomerId(
      paymentIntentObj.customer
    );
    if (!user) {
      console.log(`user not found ,log from payment_intent.succeeded`, {
        customer: paymentIntentObj.customer,
      });
    }

    const purchase = await purchaseUtils.getPurchaseById(
      paymentIntentObj.metadata.purchaseId
    );
    if (!purchase) {
      console.log(
        `purchase not found, log from payment_intent.payment_failed`,
        {
          paymentId: purchase._id.toString(),
          userId: user._id.toString(),
        }
      );
    }

    const payment = await paymentUtils.savePayment({
      userId: user._id,
      stripePaymentId: paymentIntentObj.id,
      paymentType: common.PAYMENT_TYPE.INTENT,
      amount: paymentIntentObj.amount,
      paymentMethod: paymentIntentObj.paymentMethod,
      clientSecret: paymentIntentObj.client_secret,
      planId: purchase.planId,
      stripeChargeId: paymentIntentObj.latest_charge,
      startDate: 'N/A',
      endDate: 'N/A',
      nextPaymentDate: 'N/A',
      status: 'Failed',
      reason: paymentIntentObj.last_payment_error.message,
    });

    await stripeHelper.cancelPaymentIntentInStripe(paymentIntentObj.id);
    // await paymentUtils.updatePaymentById({
    //   ...payment,
    //   paymentId: payment._id,
    //   status: "Failed",
    //   reason: paymentIntentObj.last_payment_error.message,
    // });

    purchase.transactionHistory.push(payment._id);
    await purchaseUtils.updatePurchaseById({
      ...purchase,
      purchaseId: purchase._id,
      paymentId: payment._id,
      paymentConfirmed: false,
      paymentMethod: payment.paymentMethod,
    });
  } catch (error) {
    console.log('Error log from payment_intent.payment_failed', { error });
  }
};

const paymentIntentSuceessHelperForSubscription = async (intentObj) => {
  try {
    const user = await userUtils.getUserByStripeCustomerId(intentObj.customer);
    if (!user) {
      console.log('user not found,log from invoice.payment_succeeded', {
        customer: intentObj.customer,
      });
    }
    const invoice = await stripeHelper.getInvoiceByIdFromStripe(
      intentObj.invoice
    );
    const subscription =
      await stripeHelper.getSubscriptionBySubscriptionIdInStripe(
        invoice.subscription
      );
    if (!subscription) {
      console.log(
        'subscription not found, log from invoice.payment_succeeded',
        {
          subscriptionId: intentObj.subscription,
        }
      );
    }
    const purchase = await purchaseUtils.getPurchaseById(
      subscription.metadata.purchaseId
    );
    if (!purchase) {
      console.log('purchase not found, log from invoice.payment_succeeded', {
        purchaseId: subscription.metadata.purchaseId,
      });
    }

    const promocode = await promocodeUtils.getPromocodeById(
      subscription.metadata.promocodeId
    );

    await promocodeUtils.updatePromocodeById(promocode._id, {
      ...promocode,
      usedCount: promocode.usedCount + 1,
    });

    const startDate = new Date(invoice.created * 1000);
    const endDate = new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    );

    // const startDate = new Date(invoice.status_transitions.paid_at * 1000);

    // const planEndDate = new Date(
    //   new Date().setFullYear(new Date().getFullYear() + 1)
    // );
    let nextPaymentDate;

    switch (purchase.interval) {
      case 'week':
        nextPaymentDate = new Date(
          new Date(invoice.created * 1000).setDate(
            new Date(invoice.created * 1000).getDate() + 7
          )
        );
        break;
      case 'month':
        nextPaymentDate = new Date(
          new Date(invoice.created * 1000).setMonth(
            new Date(invoice.created * 1000).getMonth() + 1
          )
        );
        break;
      case 'year':
        nextPaymentDate = new Date(
          new Date(invoice.created * 1000).setFullYear(
            new Date(invoice.created * 1000).getFullYear() + 1
          )
        );
        break;
      default:
        break;
    }

    const payment = await paymentUtils.savePayment({
      userId: user._id,
      stripePaymentId: subscription.id,
      paymentIntentId: intentObj.id,
      paymentType: subscription.metadata.paymentType,
      amount: intentObj.amount / 100,
      paymentMethod: { id: intentObj.payment_method, type: 'card' },
      planId: subscription.metadata.planId,
      stripeChargeId: intentObj.charge,
      status: 'Completed',
      startDate: startDate.toISOString(),
      endDate: nextPaymentDate.toISOString(),
      nextPaymentDate: nextPaymentDate.toISOString(),
      invoiceURL: invoice.hosted_invoice_url,
      promocodeId: subscription.metadata.promocodeId,
    });

    purchase.transactionHistory.push(payment._id);
    await purchaseUtils.updatePurchaseById({
      purchaseId: purchase._id,
      paymentId: payment._id,
      planStartDate: purchase.planStartDate
        ? purchase.planStartDate
        : new Date(),
      planEndDate: purchase.planEndDate ? purchase.planEndDate : endDate,
      nextPaymentDate,
      paymentConfirmed: true,
      transactionHistory: purchase.transactionHistory,
      paymentMethod: payment.paymentMethod,
    });
  } catch (error) {
    console.log('Error log from invoice.payment_succeeded', { error });
  }
};

const invoiceSuceessHelper = async (invoiceObj) => {
  try {
    const user = await userUtils.getUserByStripeCustomerId(invoiceObj.customer);
    if (!user) {
      console.log('user not found,log from invoice.payment_succeeded', {
        customer: invoiceObj.customer,
      });
    }

    const payment = await paymentUtils.getPaymentusingWebhookData({
      userId: user._id.toString(),
      stripePaymentId: invoiceObj.subscription,
      amount: invoiceObj.total / 100,
      paymentType: common.PAYMENT_TYPE.SUBSCRIPTION,
    });
    if (!payment) {
      console.log('payment not found, log from invoice.payment_succeeded', {
        paymentId: invoiceObj.subscription,
      });
    }

    const subscription =
      await stripeHelper.getSubscriptionBySubscriptionIdInStripe(
        invoiceObj.subscription
      );
    if (!subscription) {
      console.log(
        'subscription not found, log from invoice.payment_succeeded',
        {
          subscriptionId: invoiceObj.subscription,
        }
      );
    }

    const purchase = await purchaseUtils.getPurchaseById(
      subscription.metadata.purchaseId
    );
    if (!purchase) {
      console.log('purchase not found, log from invoice.payment_succeeded', {
        purchaseId: subscription.metadata.purchaseId,
      });
    }

    const paymentIntent = await stripeHelper.getPaymentIntentFromStripe(
      invoiceObj.payment_intent
    );
    if (payment.paymentMethod.id != paymentIntent.payment_method) {
      payment.paymentMethod = {
        id: paymentIntent.payment_method,
        type: 'card',
      };
    }

    await paymentUtils.updatePaymentById({
      ...payment,
      paymentId: payment._id,
      stripeChargeId: invoiceObj.charge,
      status: 'Completed',
    });

    const planEndDate = new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    );
    let nextPaymentDate;

    switch (purchase.interval) {
      case 'week':
        nextPaymentDate = new Date(
          new Date().setDate(new Date().getDate() + 7)
        );
        break;
      case 'month':
        nextPaymentDate = new Date(
          new Date().setMonth(new Date().getMonth() + 1)
        );
        break;
      case 'year':
        nextPaymentDate = new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        );
        break;
      default:
        break;
    }

    purchase.transactionHistory.push({
      invoiceURL: invoiceObj.invoice_pdf,
      startDate: purchase.planStartDate
        ? `${purchase.planStartDate.getDate()}/${
            purchase.planStartDate.getMonth() + 1
          }/${purchase.planStartDate.getFullYear()}`
        : `${new Date().getDate()}/${
            new Date().getMonth() + 1
          }/${new Date().getFullYear()}`,
      endDate: `${nextPaymentDate.getDate()}/${
        nextPaymentDate.getMonth() + 1
      }/${nextPaymentDate.getFullYear()}`,
      nextPaymentDate: `${nextPaymentDate.getDate()}/${
        nextPaymentDate.getMonth() + 1
      }/${nextPaymentDate.getFullYear()}`,
      amount: invoiceObj.total / 100,
      status: 'success',
      paymentMethod: payment.paymentMethod,
    });

    await purchaseUtils.updatePurchaseById({
      purchaseId: purchase._id,
      paymentId: payment._id,
      planStartDate: purchase.planStartDate
        ? purchase.planStartDate
        : new Date(),
      planEndDate: purchase.planEndDate ? purchase.planEndDate : planEndDate,
      nextPaymentDate,
      paymentConfirmed: true,
      transactionHistory: purchase.transactionHistory,
      paymentMethod: payment.paymentMethod,
    });
  } catch (error) {
    console.log('Error log from invoice.payment_succeeded', { error });
  }
};

const paymentIntentFailHelperForSubscription = async (intentObj) => {
  try {
    const user = await userUtils.getUserByStripeCustomerId(intentObj.customer);
    if (!user) {
      console.log('user not found,log from invoice.payment_failed', {
        customer: intentObj.customer,
      });
    }

    const invoice = await stripeHelper.getInvoiceByIdFromStripe(
      intentObj.invoice
    );
    if (!invoice) {
      console.log('invoice not found, log from invoice.payment_failed', {
        subscriptionId: intentObj.invoice,
      });
    }

    // stripe doesn't send subscription id in intent object while intent fail.
    const subscription =
      await stripeHelper.getSubscriptionBySubscriptionIdInStripe(
        invoice.subscription
      );
    if (!subscription) {
      console.log('subscription not found, log from invoice.payment_failed', {
        subscriptionId: intentObj.subscription,
      });
    }

    const purchase = await purchaseUtils.getPurchaseById(
      subscription.metadata.purchaseId
    );
    if (!purchase) {
      console.log('purchase not found, log from invoice.payment_failed', {
        purchaseId: subscription.metadata.purchaseId,
      });
    }

    const payment = await paymentUtils.savePayment({
      userId: user._id,
      stripePaymentId: subscription.id,
      paymentIntentId: intentObj.id,
      paymentType: subscription.metadata.paymentType,
      amount: intentObj.amount / 100,
      paymentMethod: {
        id: intentObj.last_payment_error.payment_method.id,
        type: 'card',
      },
      planId: subscription.metadata.planId,
      status: 'Failed',
      reason: intentObj.last_payment_error.message,
      startDate: 'N/A',
      endDate: 'N/A',
      nextPaymentDate: 'N/A',
      invoiceURL: 'N/A',
      promocodeId: subscription.metedata.promocodeId,
    });

    purchase.transactionHistory.push(payment._id);

    await purchaseUtils.updatePurchaseById({
      purchaseId: purchase._id,
      paymentId: payment._id,
      paymentConfirmed: false,
      transactionHistory: purchase.transactionHistory,
    });
  } catch (error) {
    console.log('Error log from invoice.payment_failed', { error });
  }
};

const invoiceFailHelper = async (invoiceObj) => {
  try {
    const user = await userUtils.getUserByStripeCustomerId(invoiceObj.customer);
    if (!user) {
      console.log('user not found,log from invoice.payment_failed', {
        customer: invoiceObj.customer,
      });
    }
    const payment = await paymentUtils.getPaymentusingWebhookData({
      userId: user._id,
      stripePaymentId: invoiceObj.subscription,
      amount: invoiceObj.total / 100,
      paymentType: common.PAYMENT_TYPE.SUBSCRIPTION,
    });
    if (!payment) {
      console.log('payment not found, log from invoice.payment_failed', {
        userId: user._id.toString(),
        stripePaymentId: invoiceObj.subscription,
        amount: invoiceObj.total / 100,
        paymentType: common.PAYMENT_TYPE.SUBSCRIPTION,
      });
    }
    const subscription =
      await stripeHelper.getSubscriptionBySubscriptionIdInStripe(
        invoiceObj.subscription
      );
    if (!subscription) {
      console.log('subscription not found, log from invoice.payment_failed', {
        subscriptionId: invoiceObj.subscription,
      });
    }
    const purchase = await purchaseUtils.getPurchaseById(
      subscription.metadata.purchaseId
    );
    if (!purchase) {
      console.log('purchase not found, log from invoice.payment_failed', {
        purchaseId: subscription.metadata.purchaseId,
      });
    }

    await paymentUtils.updatePaymentById({
      ...payment,
      paymentId: payment._id,
      status: 'Failed',
      paymentMethod: payment.paymentMethod,
    });

    purchase.transactionHistory.push({
      invoiceURL: 'N/A',
      startDate: 'N/A',
      endDate: 'N/A',
      nextPaymentDate: 'N/A',
      amount: invoiceObj.total / 100,
      status: 'failed',
    });

    await purchaseUtils.updatePurchaseById({
      purchaseId: purchase._id,
      paymentId: payment._id,
      paymentConfirmed: false,
      transactionHistory: purchase.transactionHistory,
    });
  } catch (error) {
    console.log('Error log from invoice.payment_failed', { error });
  }
};

const subscriptionCancelHelper = async (subscriptionObj) => {
  try {
    const user = await userUtils.getUserByStripeCustomerId(
      subscriptionObj.customer
    );
    if (!user) {
      console.log('user not found,log from customer.subscription.deleted', {
        customer: subscriptionObj.customer,
      });
    }
    const subscriptionToCancel =
      await stripeHelper.getSubscriptionBySubscriptionIdInStripe(
        subscriptionObj.subscription
      );
    if (!subscriptionToCancel) {
      console.log(
        'subscription not found, log from customer.subscription.deleted',
        {
          subscriptionId: subscriptionObj.subscription,
        }
      );
    }

    const purchase = await purchaseUtils.getPurchaseById(
      subscriptionToCancel.metadata.purchaseId
    );
    if (!purchase) {
      console.log(
        'purchase not found, log from customer.subscription.deleted',
        {
          purchaseId: subscriptionToCancel.metadata.purchaseId,
        }
      );
    }

    await purchaseUtils.updatePurchaseById({
      purchaseId: purchase._id,
      isCanceled: true,
      planEndDate: new Date(),
    });
  } catch (error) {
    console.log('Error log from customer.subscription.deleted', { error });
  }
};
export default {
  paymentIntentSuccessHelper,
  paymentIntentFailHelper,
  invoiceSuceessHelper,
  invoiceFailHelper,
  subscriptionCancelHelper,
};
