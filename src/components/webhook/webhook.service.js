import common from "../../constants/common.js";
import stripeHelper from "../../helper/stripe.helper.js";
import paymentUtils from "../../utils/payment.utils.js";
import userUtils from "../../utils/user.utils.js";
import purchaseUtils from "../../utils/purchase.utils.js";

const listenToWebhook = async ({ rowData, signature, endpointSecret }) => {
  try {
    const event = await stripeHelper.constructWebhookInStripe({
      rowData,
      signature,
      endpointSecret,
    });
    const eventObj = event.data.object;
    let user, payment;
    switch (event.type) {
      case "payment_intent.succeeded":
        // {
        //   paymentIntent: {
        //     id: 'pi_3QwJmqSHpKyhkVYh13RggK2n',
        //     object: 'payment_intent',
        //     amount: 1500,
        //     amount_capturable: 0,
        //     amount_details: { tip: {} },
        //     amount_received: 1500,
        //     application: null,
        //     application_fee_amount: null,
        //     automatic_payment_methods: { allow_redirects: 'always', enabled: true },
        //     canceled_at: null,
        //     cancellation_reason: null,
        //     capture_method: 'automatic_async',
        //     client_secret: 'pi_3QwJmqSHpKyhkVYh13RggK2n_secret_lKGy8mpJHxOHmPpw2G693irFf',
        //     confirmation_method: 'automatic',
        //     created: 1740473204,
        //     currency: 'inr',
        //     customer: 'cus_RoU0pnWnJRK8nb',
        //     description: null,
        //     invoice: null,
        //     last_payment_error: null,
        //     latest_charge: 'ch_3QwJmqSHpKyhkVYh1RbAAsY0',
        //     livemode: false,
        //     metadata: {},
        //     next_action: null,
        //     on_behalf_of: null,
        //     payment_method: 'pm_1QwFjkSHpKyhkVYhs56ZuEAq',
        //     payment_method_configuration_details: { id: 'pmc_1MbMncSHpKyhkVYhey9xmxDN', parent: null },
        //     payment_method_options: { card: [Object] },
        //     payment_method_types: [ 'card' ],
        //     processing: null,
        //     receipt_email: 'abc@gmail.com',
        //     review: null,
        //     setup_future_usage: null,
        //     shipping: null,
        //     source: null,
        //     statement_descriptor: null,
        //     statement_descriptor_suffix: null,
        //     status: 'succeeded',
        //     transfer_data: null,
        //     transfer_group: null
        //   }
        // }

        if (
          !eventObj.description.split("").includes("Intent") &&
          eventObj.invoice
        ) {
          break;
        }
        user = await userUtils.getUserByStripeCustomerId(eventObj.customer);
        if (!user) {
          console.log("user not found ,log from payment_intent.succeeded", {
            customer: eventObj.customer,
          });
        }
        payment = await paymentUtils.getPaymentusingWebhookData({
          userId: user._id,
          stripePaymentId: eventObj.id,
          paymentType: common.PAYMENT_TYPE.INTENT,
          amount: eventObj.amount / 100,
          clientSecret: eventObj.client_secret,
        });
        if (!payment) {
          console.log("log from payment_intent.succeeded", {
            userId: user._id,
            stripePaymentId: eventObj.id,
            paymentType: common.PAYMENT_TYPE.INTENT,
            amount: eventObj.amount / 100,
            clientSecret: eventObj.client_secret,
          });
        }
        const existingPurchase = await purchaseUtils.getPurchaseById(
          eventObj.metadata.purchaseId
        );
        if (!existingPurchase) {
          console.log("log from payment_intent.succeeded", {
            paymentId: payment._id.toString(),
            userId: user._id.toString(),
          });
        }
        await paymentUtils.updatePaymentById({
          ...payment,
          paymentId: payment._id,
          stripeChargeId: eventObj.latest_charge,
          status: "Completed",
        });

        await purchaseUtils.updatePurchaseById({
          ...existingPurchase,
          purchaseId: existingPurchase._id,
          paymentId: payment._id,
          paymentConfirmed: true,
        });
        break;

      case "payment_intent.payment_failed":
        // if (paymentIntent.description != "" && paymentIntent.invoice) {
        //   break;
        // }
        console.log({ eventObj });
        user = await userUtils.getUserByStripeCustomerId(eventObj.customer);
        if (!user) {
          console.log("user not found,log from payment_intent.payment_failed", {
            customer: eventObj.customer,
          });
        }
        if (
          !eventObj.description.split("").includes("Intent") &&
          eventObj.invoice
        ) {
          break;
          // payment = await paymentUtils.getPaymentusingWebhookData({
          //   userId: user._id.toString(),
          //   stripePaymentId: eventObj.subscription,
          //   paymentType: common.PAYMENT_TYPE.SUBSCRIPTION,
          //   amount: eventObj.amount / 100,
          // });
        }
        // else {
        payment = await paymentUtils.getPaymentusingWebhookData({
          userId: user._id,
          stripePaymentId: eventObj.id,
          paymentType: common.PAYMENT_TYPE.INTENT,
          amount: eventObj.amount / 100,
          clientSecret: eventObj.client_secret,
        });
        // }

        if (!payment) {
          console.log(
            "payment not found,log from payment_intent.payment_failed",
            {
              userId: user._id,
              stripePaymentId: eventObj.id,
              paymentType: common.PAYMENT_TYPE.INTENT,
              amount: eventObj.amount / 100,
              clientSecret: eventObj.client_secret,
            }
          );
        }
        // await stripeHelper.cancelPaymentIntentInStripe(paymentIntent.id);
        await paymentUtils.updatePaymentById({
          ...payment,
          paymentId: payment._id,
          status: "Failed",
          reason: eventObj.last_payment_error.message,
        });
        break;

      case "invoice.payment_succeeded":
        user = await userUtils.getUserByStripeCustomerId(eventObj.customer);
        if (!user) {
          console.log("user not found,log from invoice.payment_succeeded", {
            customer: eventObj.customer,
          });
        }

        payment = await paymentUtils.getPaymentusingWebhookData({
          userId: user._id.toString(),
          stripePaymentId: eventObj.subscription,
          amount: eventObj.total / 100,
          paymentType: common.PAYMENT_TYPE.SUBSCRIPTION,
        });
        if (!payment) {
          console.log("payment not found, log from invoice.payment_succeeded", {
            paymentId: eventObj.subscription,
          });
        }

        const subscription =
          await stripeHelper.getSubscriptionBySubscriptionIdInStripe(
            eventObj.subscription
          );
        if (!subscription) {
          console.log(
            "subscription not found, log from invoice.payment_succeeded",
            {
              subscriptionId: eventObj.subscription,
            }
          );
        }

        const purchase = await purchaseUtils.getPurchaseById(
          subscription.metadata.purchaseId
        );
        if (!purchase) {
          console.log(
            "purchase not found, log from invoice.payment_succeeded",
            {
              purchaseId: subscription.metadata.purchaseId,
            }
          );
        }

        //   subscription: {
        //     id: 'sub_1QxRuwSHpKyhkVYhAwkaiu3V',
        //     object: 'subscription',
        //     application: null,
        //     application_fee_percent: null,
        //     automatic_tax: { disabled_reason: null, enabled: false, liability: null },
        //     billing_cycle_anchor: 1740742786,
        //     billing_cycle_anchor_config: null,
        //     billing_thresholds: null,
        //     cancel_at: null,
        //     cancel_at_period_end: false,
        //     canceled_at: null,
        //     cancellation_details: { comment: null, feedback: null, reason: null },
        //     collection_method: 'charge_automatically',
        //     created: 1740742786,
        //     currency: 'usd',
        //     current_period_end: 1743161986,
        //     current_period_start: 1740742786,
        //     customer: 'cus_RoU0pnWnJRK8nb',
        //     days_until_due: null,
        //     default_payment_method: 'pm_1Qvy71SHpKyhkVYhGzAtCt7B',
        //     default_source: null,
        //     default_tax_rates: [],
        //     description: null,
        //     discount: null,
        //     discounts: [],
        //     ended_at: null,
        //     invoice_settings: { account_tax_ids: null, issuer: [Object] },
        //     items: {
        //       object: 'list',
        //       data: [Array],
        //       has_more: false,
        //       total_count: 1,
        //       url: '/v1/subscription_items?subscription=sub_1QxRuwSHpKyhkVYhAwkaiu3V'
        //     },
        //     latest_invoice: 'in_1QxRuwSHpKyhkVYhISpc8Z11',
        //     livemode: false,
        //     metadata: { purchaseId: '67c1a08408ac9f00ba841318' },
        //     next_pending_invoice_item_invoice: null,
        //     on_behalf_of: null,
        //     pause_collection: null,
        //     payment_settings: {
        //       payment_method_options: null,
        //       payment_method_types: null,
        //       save_default_payment_method: 'off'
        //     },
        //     pending_invoice_item_interval: null,
        //     pending_setup_intent: null,
        //     pending_update: null,
        //     plan: {
        //       id: 'price_1Qx3xjSHpKyhkVYhK94lPuqS',
        //       object: 'plan',
        //       active: true,
        //       aggregate_usage: null,
        //       amount: 20000,
        //       amount_decimal: '20000',
        //       billing_scheme: 'per_unit',
        //       created: 1740650703,
        //       currency: 'usd',
        //       interval: 'month',
        //       interval_count: 1,
        //       livemode: false,
        //       metadata: {},
        //       meter: null,
        //       nickname: null,
        //       product: 'prod_RqkJ51JjQEpCmO',
        //       tiers_mode: null,
        //       transform_usage: null,
        //       trial_period_days: null,
        //       usage_type: 'licensed'
        //     },
        //     quantity: 1,
        //     schedule: null,
        //     start_date: 1740742786,
        //     status: 'active',
        //     test_clock: null,
        //     transfer_data: null,
        //     trial_end: null,
        //     trial_settings: { end_behavior: [Object] },
        //     trial_start: null
        //   }
        // }
        await paymentUtils.updatePaymentById({
          ...payment,
          paymentId: payment._id,
          stripeChargeId: eventObj.charge,
          status: "Completed",
        });

        const planEndDate = new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        );
        let nextPaymentDate, time;
        if (
          purchase.nextPaymentDate &&
          purchase.nextPaymentDate.getTime() <
            eventObj.status_transitions.paid_at * 1000
        ) {
          time = eventObj.status_transitions.paid_at * 1000;
        } else {
          time = Date.now();
        }
        if (purchase.interval == "week") {
          nextPaymentDate = new Date(time);
          nextPaymentDate.setDate(new Date(time).getDate() + 7);

          // nextPaymentDate = new Date(
          //   new Date(time).setDate(new Date().getDate() + 7)
          // );
        } else if (purchase.interval == "month") {
          nextPaymentDate = new Date(time);
          nextPaymentDate.setMonth(new Date(time).getMonth() + 1);

          // nextPaymentDate = new Date(
          //   new Date(time).setMonth(new Date().getMonth() + 1)
          // );
        } else if (purchase.interval == "year") {
          nextPaymentDate = new Date(time);
          nextPaymentDate.setFullYear(new Date(time).getFullYear() + 1);

          // nextPaymentDate = new Date(
          //   new Date(time).setFullYear(new Date().getFullYear() + 1)
          // );
        }

        await purchaseUtils.updatePurchaseById({
          purchaseId: purchase._id,
          paymentId: payment._id,
          planStartDate: purchase.planStartDate
            ? purchase.planStartDate
            : new Date(),
          planEndDate: purchase.planEndDate
            ? purchase.planEndDate
            : planEndDate,
          nextPaymentDate,
          invoiceURL: eventObj.invoice_pdf,
          paymentConfirmed: true,
        });
        break;

      case "invoice.payment_failed":
        user = await userUtils.getUserByStripeCustomerId(eventObj.customer);
        if (!user) {
          console.log("user not found,log from invoice.payment_succeeded", {
            customer: eventObj.customer,
          });
        }
        payment = await paymentUtils.getPaymentusingWebhookData({
          userId: user._id.toString(),
          stripePaymentId: eventObj.subscription,
          amount: eventObj.total / 100,
          paymentType: common.PAYMENT_TYPE.SUBSCRIPTION,
        });
        if (!payment) {
          console.log("payment not found, log from invoice.payment_succeeded", {
            paymentId: eventObj.subscription,
          });
        }

        const purchaseToFail = await purchaseUtils.getPurchaseById(
          subscription.metadata.purchaseId
        );
        if (!purchase) {
          console.log(
            "purchase not found, log from invoice.payment_succeeded",
            {
              purchaseId: subscription.metadata.purchaseId,
            }
          );
        }

        await paymentUtils.updatePaymentById({
          ...payment,
          paymentId: payment._id,
          status: "Failed",
        });

        await purchaseUtils.updatePurchaseById({
          purchaseId: purchaseToFail._id,
          paymentId: payment._id,
          paymentConfirmed: false,
        });

        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return event;
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
