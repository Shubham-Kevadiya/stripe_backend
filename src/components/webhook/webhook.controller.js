import config from "../../config/config.js";
import stripeHelper from "../../helper/stripe.helper.js";
import paymentUtils from "../../utils/payment.utils.js";
import userUtils from "../../utils/user.utils.js";
import webhookService from "./webhook.service.js";

const listenToWebhook = async (req, res, next) => {
  try {
    // console.log(res.data);
    const rowData = req.body;
    const signature = req.headers["stripe-signature"];
    const event = await webhookService.listenToWebhook({
      rowData,
      signature,
      endpointSecret: config.stipe.webhook_secret,
    });
    console.log(event.type);
    // const paymentIntent = event.data.object;
    // let user, payment;
    // switch (event.type) {
    //   case "payment_intent.succeeded":
    //     // {
    //     //   paymentIntent: {
    //     //     id: 'pi_3QwJmqSHpKyhkVYh13RggK2n',
    //     //     object: 'payment_intent',
    //     //     amount: 1500,
    //     //     amount_capturable: 0,
    //     //     amount_details: { tip: {} },
    //     //     amount_received: 1500,
    //     //     application: null,
    //     //     application_fee_amount: null,
    //     //     automatic_payment_methods: { allow_redirects: 'always', enabled: true },
    //     //     canceled_at: null,
    //     //     cancellation_reason: null,
    //     //     capture_method: 'automatic_async',
    //     //     client_secret: 'pi_3QwJmqSHpKyhkVYh13RggK2n_secret_lKGy8mpJHxOHmPpw2G693irFf',
    //     //     confirmation_method: 'automatic',
    //     //     created: 1740473204,
    //     //     currency: 'inr',
    //     //     customer: 'cus_RoU0pnWnJRK8nb',
    //     //     description: null,
    //     //     invoice: null,
    //     //     last_payment_error: null,
    //     //     latest_charge: 'ch_3QwJmqSHpKyhkVYh1RbAAsY0',
    //     //     livemode: false,
    //     //     metadata: {},
    //     //     next_action: null,
    //     //     on_behalf_of: null,
    //     //     payment_method: 'pm_1QwFjkSHpKyhkVYhs56ZuEAq',
    //     //     payment_method_configuration_details: { id: 'pmc_1MbMncSHpKyhkVYhey9xmxDN', parent: null },
    //     //     payment_method_options: { card: [Object] },
    //     //     payment_method_types: [ 'card' ],
    //     //     processing: null,
    //     //     receipt_email: 'abc@gmail.com',
    //     //     review: null,
    //     //     setup_future_usage: null,
    //     //     shipping: null,
    //     //     source: null,
    //     //     statement_descriptor: null,
    //     //     statement_descriptor_suffix: null,
    //     //     status: 'succeeded',
    //     //     transfer_data: null,
    //     //     transfer_group: null
    //     //   }
    //     // }
    //     user = await userUtils.getUserByStripeCustomerId(
    //       paymentIntent.customer
    //     );
    //     if (!user) {
    //       console.log("log from payment_intent.succeeded", { paymentIntent });
    //     }
    //     payment = await paymentUtils.getPaymentusingWebhookData({
    //       userId: user._id,
    //       stripePaymentId: paymentIntent.id,
    //       paymentType: "Intent",
    //       amount: paymentIntent.amount / 100,
    //       clientSecret: paymentIntent.client_secret,
    //     });
    //     if (!payment) {
    //       console.log("log from payment_intent.succeeded", { payment });
    //     }
    //     await paymentUtils.updatePaymentById({
    //       ...payment,
    //       paymentId: payment._id,
    //       stripeChargeId: paymentIntent.latest_charge,
    //       status: "Completed",
    //     });
    //     break;

    //   case "payment_intent.payment_failed":
    //     user = await userUtils.getUserByStripeCustomerId(
    //       paymentIntent.customer
    //     );
    //     if (!user) {
    //       console.log("log from payment_intent.succeeded", { paymentIntent });
    //     }
    //     payment = await paymentUtils.getPaymentusingWebhookData({
    //       userId: user._id,
    //       stripePaymentId: paymentIntent.id,
    //       paymentType: "Intent",
    //       amount: paymentIntent.amount / 100,
    //       clientSecret: paymentIntent.client_secret,
    //     });
    //     if (!payment) {
    //       console.log("log from payment_intent.succeeded", { payment });
    //     }
    //     await stripeHelper.cancelPaymentIntentInStripe(paymentIntent.id);
    //     await paymentUtils.updatePaymentById({
    //       ...payment,
    //       status: "Failed",
    //     });
    //     break;
    //   default:
    //     console.log(`Unhandled event type ${event.type}`);
    // }

    // Return a response to acknowledge receipt of the event
    return res.json({ received: true });
  } catch (error) {
    console.log("error", "error in webhook event", error);
    next(error);
  }
};

export default {
  listenToWebhook,
};
