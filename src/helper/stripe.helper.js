import Stripe from "stripe";
import config from "../config/config.js";
import common from "../constants/common.js";

const stripe = Stripe(config.stipe.secret_key);

const createCustomerInStripe = async (customerData) => {
  try {
    const customer = await stripe.customers.create({
      name: customerData.name,
      email: customerData.email,
    });
    return customer;
  } catch (error) {
    console.log("Error from create customer in stripe", { error });
    throw new Error("Error from create customer in stripe", { error });
  }
};

const createProductInStripe = async (productName) => {
  try {
    const product = await stripe.products.create({
      name: productName,
    });
    return product;
  } catch (error) {
    console.log("Error from create product in stripe", { error });
    throw new Error("Error from create product in stripe", { error });
  }
};

const updateProductNameInStripe = async (productId, productName) => {
  try {
    const product = await stripe.products.update(productId, {
      name: productName,
    });
    return product;
  } catch (error) {
    console.log("Error from update product in stripe", { error });
    throw new Error("Error from update product in stripe", { error });
  }
};

const createPriceInStripe = async (productData) => {
  try {
    const price = await stripe.prices.create(productData);
    return price;
  } catch (error) {
    console.log("Error from create price in stripe", { error });
    throw new Error("Error from create price in stripe", { error });
  }
};

const updatePriceInStripe = async (priceId, status) => {
  try {
    await stripe.prices.update(priceId, {
      active: status,
    });
    return "Price updated successfully";
  } catch (error) {
    console.log("Error from update price in stripe", { error });
    throw new Error("Error from update price in stripe", { error });
  }
};

const deletePriceInStripe = async (priceId, status) => {
  try {
    await stripe.prices.update(priceId, {
      active: status,
    });
    return "Price updated successfully";
  } catch (error) {
    console.log("Error from delete price in stripe", { error });
    throw new Error("Error from delete price in stripe", { error });
  }
};

const deleteProductInStripe = async (productId) => {
  try {
    await stripe.products.del(productId);
    return "Product deleted successfully";
  } catch (error) {
    console.log("Error from delete product in stripe", { error });
    throw new Error("Error from delete product in stripe", { error });
  }
};

const createPaymentMethodInStripe = async (paymentMethodData) => {
  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type: common.TYPE,
      card: {
        token:
          common.STRIPE_TEST_CARD[
            Object.keys(common.STRIPE_TEST_CARD)[
              Math.floor(
                Math.random() * Object.keys(common.STRIPE_TEST_CARD).length
              )
            ]
          ],
        // "tok_chargeCustomerFail", // card to fail payment intent
      },
      billing_details: paymentMethodData,
    });
    return paymentMethod;
  } catch (error) {
    console.log("Error from create payment method in stripe", { error });
    throw new Error("Error from create payment method in stripe", { error });
  }
};

const attachCustomerToPaymentMethodInStripe = async (
  paymentMethodId,
  customerId
) => {
  try {
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    return paymentMethod;
  } catch (error) {
    console.log("Error from attaching customer to payment method in stripe", {
      error,
    });
    throw new Error(
      "Error from attaching customer to payment method in stripe",
      { error }
    );
  }
};

const updatePaymentMethodInStripe = async (
  paymentMethodData,
  paymentMethodId
) => {
  try {
    const paymentMethod = await stripe.paymentMethods.update(paymentMethodId, {
      billing_details: paymentMethodData,
    });
    return paymentMethod;
  } catch (error) {
    console.log("Error from update payment method in stripe", { error });
    throw new Error("Error from update payment method in stripe", { error });
  }
};

const getPaymentMethodOfUserFromStripe = async (
  customerId,
  limit,
  paymentMethodId
) => {
  try {
    const paymentMethodOfUser = await stripe.customers.listPaymentMethods(
      customerId,
      {
        limit: limit,
        starting_after: paymentMethodId,
      }
    );
    return { data: paymentMethodOfUser, hasMore: paymentMethodOfUser.has_more };
  } catch (error) {
    console.log("Error from get payment method of user from stripe", { error });
    throw new Error("Error from get payment method of user from stripe", {
      error,
    });
  }
};

const getPaymentMethodInStripe = async (paymentMethodId) => {
  try {
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    return paymentMethod;
  } catch (error) {
    console.log("Error from get payment method by id from stripe", { error });
    throw new Error("Error from get payment method by id from stripe", {
      error,
    });
  }
};

const detachPaymentMethodInStripe = async (paymentMethodId) => {
  try {
    const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);
    return paymentMethod;
  } catch (error) {}
  console.log("Error from detach payment method in stripe", { error });
  throw new Error("Error from detach payment method in stripe", { error });
};

const createPaymentIntentInStripe = async ({
  amount,
  currency,
  customerId,
  paymentMethod,
  description,
}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      customer: customerId,
      payment_method: paymentMethod,
      description: description ? description : "",
      setup_future_usage: "on_session",
    });
    return paymentIntent;
  } catch (error) {
    console.log("Error from create payment intent in stripe", { error });
    throw new Error("Error from create payment intent in stripe", { error });
  }
};

const updatePaymentIntentInStripe = async (paymentIntentId, metadata) => {
  try {
    const paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
      metadata: {
        ...metadata,
      },
    });
    return paymentIntent;
  } catch (error) {
    console.log("Error from create payment intent in stripe", { error });
    throw new Error("Error from create payment intent in stripe", { error });
  }
};

const confirmPaymentIntentInStripe = async ({
  paymentIntentId,
  paymentMethod,
}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethod,
      // payment_method: "pm_1QynpaSHpKyhkVYhg975EiCZ",
      return_url: "https://www.youtube.com",
    });
    return paymentIntent;
  } catch (error) {
    console.log("Error from confirm payment intent in stripe", { error });
    throw new Error("Error from confirm payment intent in stripe", { error });
  }
};

const cancelPaymentIntentInStripe = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.log("Error from cancel payment intent in stripe", { error });
    throw new Error("Error from cancel payment intent in stripe", { error });
  }
};

const createSubscriptionInStripe = async (
  paymentMethodId,
  customerId,
  price
) => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: price,
      default_payment_method: paymentMethodId,
      collection_method: common.SUBSCRIPTION.COLLECTION_METHOD,
    });
    return subscription;
  } catch (error) {
    console.log("Error from create subscription", { error });
    throw new Error("Error from create subscription", { error });
  }
};

const pauseSubscriptionInStripe = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      pause_collection: {
        behavior: common.PAUSE_COLLECTION_TYPE.MARK_UNCOLLECTIBLE,
      },
    });
    return subscription;
  } catch (error) {
    console.log("Error from pause subscription", { error });
    throw new Error("Error from pause subscription", { error });
  }
};

const updateSubscriptionInStripe = async (subscriptionId, metadata) => {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      metadata: {
        ...metadata,
      },
    });
    return subscription;
  } catch (error) {
    console.log("Error from update subscription", { error });
    throw new Error("Error from update subscription", { error });
  }
};

const resumeSubscriptionInStripe = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      pause_collection: "",
    });
    // const subscription = await stripe.subscriptions.resume(subscriptionId, {
    //   proration_behavior: "always_invoice",
    // });
    return subscription;
  } catch (error) {
    console.log("Error from resume subscription", { error });
    throw new Error("Error from resume subscription", { error });
  }
};

const getSubscriptionBySubscriptionIdInStripe = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.log("Error from get subscription", { error });
    throw new Error("Error from get subscription", { error });
  }
};

const cancelSubscriptionInStripe = async (subscriptionId, reason) => {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId, {
      cancellation_details: {
        reason,
      },
    });
    return subscription;
  } catch (error) {
    console.log("Error from update subscription", { error });
    throw new Error("Error from update subscription", { error });
  }
};

const getInvoiceByIdFromStripe = async (invoiceId) => {
  try {
    const invoice = await stripe.invoices.retrieve(invoiceId);
    return invoice;
  } catch (error) {
    console.log("Error from getting invoice in stripe", { error });
    throw new Error("Error from getting invoice in stripe", { error });
  }
};

const constructWebhookInStripe = async ({
  rowData,
  signature,
  endpointSecret,
}) => {
  try {
    const event = stripe.webhooks.constructEvent(
      rowData,
      signature,
      endpointSecret
    );
    return event;
  } catch (error) {
    console.log("Error from construct webhook in stripe", { error });
    throw new Error("Error from construct webhook in stripe", { error });
  }
};

// const getUpcomingInvoiceOfCustomer = async (subscription) => {
//   const invoice = await stripe.invoices.retrieveUpcoming({ subscription });
//   return invoice;
// };

export default {
  createCustomerInStripe,
  createProductInStripe,
  updateProductNameInStripe,
  createPriceInStripe,
  updatePriceInStripe,
  deletePriceInStripe,
  deleteProductInStripe,
  createPaymentMethodInStripe,
  attachCustomerToPaymentMethodInStripe,
  updatePaymentMethodInStripe,
  getPaymentMethodOfUserFromStripe,
  getPaymentMethodInStripe,
  detachPaymentMethodInStripe,
  createPaymentIntentInStripe,
  updatePaymentIntentInStripe,
  confirmPaymentIntentInStripe,
  cancelPaymentIntentInStripe,
  createSubscriptionInStripe,
  pauseSubscriptionInStripe,
  resumeSubscriptionInStripe,
  updateSubscriptionInStripe,
  cancelSubscriptionInStripe,
  getSubscriptionBySubscriptionIdInStripe,
  getInvoiceByIdFromStripe,
  constructWebhookInStripe,
  // getUpcomingInvoiceOfCustomer,
};
