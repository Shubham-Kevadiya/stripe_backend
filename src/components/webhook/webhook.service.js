import stripeHelper from "../../helper/stripe.helper.js";
import webhookHelper from "../../helper/webhook.helper.js";

const listenToWebhook = async ({ rowData, signature, endpointSecret }) => {
  try {
    const event = await stripeHelper.constructWebhookInStripe({
      rowData,
      signature,
      endpointSecret,
    });
    const eventObj = event.data.object;
    // switch (event.type) {
    //   case "payment_intent.succeeded":
    //     // if (
    //     //   !eventObj.description.split("").includes("Intent") &&
    //     //   eventObj.invoice
    //     // ) {
    //     //   break;
    //     // }
    //     // user = await userUtils.getUserByStripeCustomerId(eventObj.customer);
    //     // if (!user) {
    //     //   console.log("user not found ,log from payment_intent.succeeded", {
    //     //     customer: eventObj.customer,
    //     //   });
    //     // }
    //     // payment = await paymentUtils.getPaymentusingWebhookData({
    //     //   userId: user._id.toString(),
    //     //   stripePaymentId: eventObj.id,
    //     //   paymentType: common.PAYMENT_TYPE.INTENT,
    //     //   amount: eventObj.amount / 100,
    //     //   clientSecret: eventObj.client_secret,
    //     // });
    //     // if (!payment) {
    //     //   console.log("log from payment_intent.succeeded", {
    //     //     userId: user._id,
    //     //     stripePaymentId: eventObj.id,
    //     //     paymentType: common.PAYMENT_TYPE.INTENT,
    //     //     amount: eventObj.amount / 100,
    //     //     clientSecret: eventObj.client_secret,
    //     //   });
    //     // }
    //     // purchase = await purchaseUtils.getPurchaseById(
    //     //   eventObj.metadata.purchaseId
    //     // );
    //     // if (!purchase) {
    //     //   console.log("log from payment_intent.succeeded", {
    //     //     paymentId: payment._id.toString(),
    //     //     userId: user._id.toString(),
    //     //   });
    //     // }
    //     // await paymentUtils.updatePaymentById({
    //     //   ...payment,
    //     //   paymentId: payment._id,
    //     //   stripeChargeId: eventObj.latest_charge,
    //     //   status: "Completed",
    //     // });
    //     // purchase.transactionHistory.push({
    //     //   amount: eventObj.amount / 100,
    //     //   startDate: `${new Date().getDate()}/${
    //     //     new Date().getMonth() + 1
    //     //   }/${new Date().getFullYear()}`,
    //     //   endDate: `${new Date().getDate()}/${
    //     //     new Date().getMonth() + 1
    //     //   }/${new Date(new Date().setFullYear(new Date().getFullYear() + 1))}`,
    //     //   status: "success",
    //     // });
    //     // await purchaseUtils.updatePurchaseById({
    //     //   ...purchase,
    //     //   purchaseId: purchase._id,
    //     //   paymentId: payment._id,
    //     //   paymentConfirmed: true,
    //     // });
    //     await webhookHelper.webHookHelper(eventObj, event.type);
    //     break;

    //   case "payment_intent.payment_failed":
    //     // if (
    //     //   !eventObj.description.split("").includes("Intent") &&
    //     //   eventObj.invoice
    //     // ) {
    //     //   break;
    //     // }
    //     // user = await userUtils.getUserByStripeCustomerId(eventObj.customer);
    //     // if (!user) {
    //     //   console.log("user not found,log from payment_intent.payment_failed", {
    //     //     customer: eventObj.customer,
    //     //   });
    //     // }

    //     // payment = await paymentUtils.getPaymentusingWebhookData({
    //     //   userId: user._id.toString(),
    //     //   stripePaymentId: eventObj.id,
    //     //   paymentType: common.PAYMENT_TYPE.INTENT,
    //     //   amount: eventObj.amount / 100,
    //     //   clientSecret: eventObj.client_secret,
    //     // });

    //     // if (!payment) {
    //     //   console.log(
    //     //     "payment not found,log from payment_intent.payment_failed",
    //     //     {
    //     //       userId: user._id,
    //     //       stripePaymentId: eventObj.id,
    //     //       paymentType: common.PAYMENT_TYPE.INTENT,
    //     //       amount: eventObj.amount / 100,
    //     //       clientSecret: eventObj.client_secret,
    //     //     }
    //     //   );
    //     // }

    //     // purchase = await purchaseUtils.getPurchaseById(
    //     //   eventObj.metadata.purchaseId
    //     // );
    //     // if (!purchase) {
    //     //   console.log("log from payment_intent.succeeded", {
    //     //     paymentId: payment._id.toString(),
    //     //     userId: user._id.toString(),
    //     //   });
    //     // }

    //     // // await stripeHelper.cancelPaymentIntentInStripe(paymentIntent.id);

    //     // await paymentUtils.updatePaymentById({
    //     //   ...payment,
    //     //   paymentId: payment._id,
    //     //   status: "Failed",
    //     //   reason: eventObj.last_payment_error.message,
    //     // });

    //     // purchase.transactionHistory.push({
    //     //   amount: eventObj.amount / 100,
    //     //   startDate: "N/A",
    //     //   endDate: "N/A",
    //     //   status: "Failed",
    //     // });
    //     // await purchaseUtils.updatePurchaseById({
    //     //   ...purchase,
    //     //   purchaseId: purchase._id,
    //     //   paymentId: payment._id,
    //     //   paymentConfirmed: false,
    //     // });
    //     break;

    //   case "invoice.payment_succeeded":
    //     // user = await userUtils.getUserByStripeCustomerId(eventObj.customer);
    //     // if (!user) {
    //     //   console.log("user not found,log from invoice.payment_succeeded", {
    //     //     customer: eventObj.customer,
    //     //   });
    //     // }

    //     // payment = await paymentUtils.getPaymentusingWebhookData({
    //     //   userId: user._id.toString(),
    //     //   stripePaymentId: eventObj.subscription,
    //     //   amount: eventObj.total / 100,
    //     //   paymentType: common.PAYMENT_TYPE.SUBSCRIPTION,
    //     // });
    //     // if (!payment) {
    //     //   console.log("payment not found, log from invoice.payment_succeeded", {
    //     //     paymentId: eventObj.subscription,
    //     //   });
    //     // }

    //     // const subscription =
    //     //   await stripeHelper.getSubscriptionBySubscriptionIdInStripe(
    //     //     eventObj.subscription
    //     //   );
    //     // if (!subscription) {
    //     //   console.log(
    //     //     "subscription not found, log from invoice.payment_succeeded",
    //     //     {
    //     //       subscriptionId: eventObj.subscription,
    //     //     }
    //     //   );
    //     // }

    //     // const purchase = await purchaseUtils.getPurchaseById(
    //     //   subscription.metadata.purchaseId
    //     // );
    //     // if (!purchase) {
    //     //   console.log(
    //     //     "purchase not found, log from invoice.payment_succeeded",
    //     //     {
    //     //       purchaseId: subscription.metadata.purchaseId,
    //     //     }
    //     //   );
    //     // }

    //     // await paymentUtils.updatePaymentById({
    //     //   ...payment,
    //     //   paymentId: payment._id,
    //     //   stripeChargeId: eventObj.charge,
    //     //   status: "Completed",
    //     // });

    //     // const planEndDate = new Date(
    //     //   new Date().setFullYear(new Date().getFullYear() + 1)
    //     // );
    //     // let nextPaymentDate;
    //     // // time;
    //     // // if (
    //     // //   purchase.nextPaymentDate &&
    //     // //   purchase.nextPaymentDate.getTime() <
    //     // //     eventObj.status_transitions.paid_at * 1000
    //     // // ) {
    //     // //   time = eventObj.status_transitions.paid_at * 1000;
    //     // // } else {
    //     // //   time = Date.now();
    //     // // }
    //     // // console.log(
    //     // //   purchase.nextPaymentDate.getTime(),
    //     // //   eventObj.status_transitions.paid_at * 1000
    //     // // );

    //     // if (purchase.interval == "week") {
    //     //   // nextPaymentDate = new Date(time);
    //     //   // nextPaymentDate.setDate(new Date(time).getDate() + 7);

    //     //   nextPaymentDate = new Date(
    //     //     new Date().setDate(new Date().getDate() + 7)
    //     //   );
    //     // } else if (purchase.interval == "month") {
    //     //   // nextPaymentDate = new Date(time);
    //     //   // nextPaymentDate.setMonth(new Date(time).getMonth() + 1);

    //     //   nextPaymentDate = new Date(
    //     //     new Date().setMonth(new Date().getMonth() + 1)
    //     //   );
    //     // } else if (purchase.interval == "year") {
    //     //   // nextPaymentDate = new Date(time);
    //     //   // nextPaymentDate.setFullYear(new Date(time).getFullYear() + 1);

    //     //   nextPaymentDate = new Date(
    //     //     new Date().setFullYear(new Date().getFullYear() + 1)
    //     //   );
    //     // }

    //     // purchase.transactionHistory.push({
    //     //   invoiceURL: eventObj.invoice_pdf,
    //     //   startDate: purchase.planStartDate
    //     //     ? `${purchase.planStartDate.getDate()}/${
    //     //         purchase.planStartDate.getMonth() + 1
    //     //       }/${purchase.planStartDate.getFullYear()}`
    //     //     : `${new Date().getDate()}/${
    //     //         new Date().getMonth() + 1
    //     //       }/${new Date().getFullYear()}`,
    //     //   endDate: `${nextPaymentDate.getDate()}/${
    //     //     nextPaymentDate.getMonth() + 1
    //     //   }/${nextPaymentDate.getFullYear()}`,
    //     //   nextPaymentDate: `${nextPaymentDate.getDate()}/${
    //     //     nextPaymentDate.getMonth() + 1
    //     //   }/${nextPaymentDate.getFullYear()}`,
    //     //   amount: eventObj.total / 100,
    //     //   status: "success",
    //     // });

    //     // await purchaseUtils.updatePurchaseById({
    //     //   purchaseId: purchase._id,
    //     //   paymentId: payment._id,
    //     //   planStartDate: purchase.planStartDate
    //     //     ? purchase.planStartDate
    //     //     : new Date(),
    //     //   planEndDate: purchase.planEndDate
    //     //     ? purchase.planEndDate
    //     //     : planEndDate,
    //     //   nextPaymentDate,
    //     //   // invoiceURL: eventObj.invoice_pdf,
    //     //   paymentConfirmed: true,
    //     //   transactionHistory: purchase.transactionHistory,
    //     // });
    //     break;

    //   case "invoice.payment_failed":
    //     // user = await userUtils.getUserByStripeCustomerId(eventObj.customer);
    //     // if (!user) {
    //     //   console.log("user not found,log from invoice.payment_failed", {
    //     //     customer: eventObj.customer,
    //     //   });
    //     // }
    //     // payment = await paymentUtils.getPaymentusingWebhookData({
    //     //   userId: user._id,
    //     //   stripePaymentId: eventObj.subscription,
    //     //   amount: eventObj.total / 100,
    //     //   paymentType: common.PAYMENT_TYPE.SUBSCRIPTION,
    //     // });
    //     // if (!payment) {
    //     //   console.log("payment not found, log from invoice.payment_failed", {
    //     //     userId: user._id.toString(),
    //     //     stripePaymentId: eventObj.subscription,
    //     //     amount: eventObj.total / 100,
    //     //     paymentType: common.PAYMENT_TYPE.SUBSCRIPTION,
    //     //   });
    //     // }
    //     // const subscriptionOfFailedPayment =
    //     //   await stripeHelper.getSubscriptionBySubscriptionIdInStripe(
    //     //     eventObj.subscription
    //     //   );
    //     // if (!subscriptionOfFailedPayment) {
    //     //   console.log(
    //     //     "subscription not found, log from invoice.payment_failed",
    //     //     {
    //     //       subscriptionId: eventObj.subscription,
    //     //     }
    //     //   );
    //     // }
    //     // purchase = await purchaseUtils.getPurchaseById(
    //     //   subscriptionOfFailedPayment.metadata.purchaseId
    //     // );
    //     // if (!purchase) {
    //     //   console.log("purchase not found, log from invoice.payment_failed", {
    //     //     purchaseId: subscriptionOfFailedPayment.metadata.purchaseId,
    //     //   });
    //     // }

    //     // await paymentUtils.updatePaymentById({
    //     //   ...payment,
    //     //   paymentId: payment._id,
    //     //   status: "Failed",
    //     // });

    //     // purchase.transactionHistory.push({
    //     //   invoiceURL: "N/A",
    //     //   startDate: "N/A",
    //     //   endDate: "N/A",
    //     //   nextPaymentDate: "N/A",
    //     //   amount: eventObj.total / 100,
    //     //   status: "failed",
    //     // });

    //     // await purchaseUtils.updatePurchaseById({
    //     //   purchaseId: purchase._id,
    //     //   paymentId: payment._id,
    //     //   paymentConfirmed: false,
    //     //   transactionHistory: purchase.transactionHistory,
    //     // });

    //     break;

    //   case "customer.subscription.deleted":
    //     // user = await userUtils.getUserByStripeCustomerId(eventObj.customer);
    //     // if (!user) {
    //     //   console.log("user not found,log from invoice.payment_failed", {
    //     //     customer: eventObj.customer,
    //     //   });
    //     // }
    //     // payment = await paymentUtils.getPaymentusingWebhookData({
    //     //   userId: user._id,
    //     //   stripePaymentId: eventObj.subscription,
    //     //   // amount: eventObj.total / 100,
    //     //   paymentType: common.PAYMENT_TYPE.SUBSCRIPTION,
    //     // });
    //     // if (!payment) {
    //     //   console.log("payment not found, log from invoice.payment_failed", {
    //     //     userId: user._id.toString(),
    //     //     stripePaymentId: eventObj.subscription,
    //     //     amount: eventObj.total / 100,
    //     //     paymentType: common.PAYMENT_TYPE.SUBSCRIPTION,
    //     //   });
    //     // }
    //     // const subscriptionToCancel =
    //     //   await stripeHelper.getSubscriptionBySubscriptionIdInStripe(
    //     //     eventObj.subscription
    //     //   );
    //     // if (!subscriptionToCancel) {
    //     //   console.log(
    //     //     "subscription not found, log from invoice.payment_failed",
    //     //     {
    //     //       subscriptionId: eventObj.subscription,
    //     //     }
    //     //   );
    //     // }

    //     // purchase = await purchaseUtils.getPurchaseById(
    //     //   subscriptionToCancel.metadata.purchaseId
    //     // );
    //     // if (!purchase) {
    //     //   console.log("purchase not found, log from invoice.payment_failed", {
    //     //     purchaseId: subscriptionToCancel.metadata.purchaseId,
    //     //   });
    //     // }

    //     // await purchaseUtils.updatePurchaseById({
    //     //   paymentId: payment._id,
    //     //   purchaseId: purchase._id,
    //     //   isCanceled: true,
    //     //   planEndDate: new Date(),
    //     // });
    //     break;
    //   default:
    //     console.log(`Unhandled event type ${event.type}`);
    // }
    // return event;
    console.log({ type: event.type });
    switch (event.type) {
      case "payment_intent.succeeded":
        await webhookHelper.paymentIntentSuccessHelper(eventObj);
        break;
      case "payment_intent.payment_failed":
        await webhookHelper.paymentIntentFailHelper(eventObj);
        break;
      // case "invoice.payment_succeeded":
      //   console.log({ eventObj });
      //   await webhookHelper.invoiceSuceessHelper(eventObj);
      //   break;
      case "payment_intent.payment_failed":
        await webhookHelper.invoiceFailHelper(eventObj);
        break;
      case "customer.subscription.deleted":
        await webhookHelper.subscriptionCancelHelper(eventObj);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.log("error from webhook", { error });
    throw new Error(error.message);
  }
};

const actionOnPaymentIntentFaild = async () => {};

export default {
  listenToWebhook,
  actionOnPaymentIntentFaild,
};
