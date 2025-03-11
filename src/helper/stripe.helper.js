import Stripe from "stripe";
import config from "../config/config.js";
import common from "../constants/common.js";

const stripe = Stripe(config.stipe.secret_key, {
  maxNetworkRetries: 2,
});

const createCustomerInStripe = async (customerData) => {
  const customer = await stripe.customers.create({
    name: customerData.name,
    email: customerData.email,
  });
  return customer;
};

const getCustomerFromStripe = async (customerId) => {
  const customer = await stripe.customers.retrieve(customerId);
  return customer;
};

const setDefaultPaymenteMethodToCustomerInStripe = async (
  customerId,
  paymentMethodId
) => {
  const customer = await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });
  return customer;
};

const createProductInStripe = async (productName) => {
  const product = await stripe.products.create({
    name: productName,
  });
  return product;
};

const updateProductNameInStripe = async (productId, productName) => {
  const product = await stripe.products.update(productId, {
    name: productName,
  });
  return product;
};

const createPriceInStripe = async (productData) => {
  const price = await stripe.prices.create(productData);
  return price;
};

const updatePriceInStripe = async (priceId, status) => {
  await stripe.prices.update(priceId, {
    active: status,
  });
  return "Price updated successfully";
};

const deletePriceInStripe = async (priceId, status) => {
  await stripe.prices.update(priceId, {
    active: status,
  });
  return "Price updated successfully";
};

const deleteProductInStripe = async (productId) => {
  await stripe.products.del(productId);
  return "Product deleted successfully";
};

const createTokenForPaymenthodInStripe = async (cardData) => {
  const token = await stripe.tokens.create({
    card: cardData,
  });
  return token;
};

const createPaymentMethodInStripe = async (billingDetails, token) => {
  const paymentMethod = await stripe.paymentMethods.create({
    type: common.TYPE,
    card: {
      token: token,
      // common.STRIPE_TEST_CARD[
      //   Object.keys(common.STRIPE_TEST_CARD)[
      //     Math.floor(
      //       Math.random() * Object.keys(common.STRIPE_TEST_CARD).length
      //     )
      //   ]
      // ],
      // "tok_chargeCustomerFail", // card to fail payment intent
    },
    billing_details: billingDetails,
  });
  return paymentMethod;
};

const attachCustomerToPaymentMethodInStripe = async (
  paymentMethodId,
  customerId
) => {
  const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });
  return paymentMethod;
};

const updatePaymentMethodInStripe = async (
  paymentMethodData,
  paymentMethodId
) => {
  const paymentMethod = await stripe.paymentMethods.update(paymentMethodId, {
    billing_details: paymentMethodData,
  });
  return paymentMethod;
};

const getPaymentMethodOfUserFromStripe = async (
  customerId,
  limit,
  paymentMethodId
) => {
  const paymentMethodOfUser = await stripe.customers.listPaymentMethods(
    customerId,
    {
      limit: limit,
      starting_after: paymentMethodId,
    }
  );
  return { data: paymentMethodOfUser, hasMore: paymentMethodOfUser.has_more };
};

const getPaymentMethodInStripe = async (paymentMethodId) => {
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
  return paymentMethod;
};

const detachPaymentMethodInStripe = async (paymentMethodId) => {
  const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);
  return paymentMethod;
};

const createPaymentIntentInStripe = async ({
  amount,
  currency,
  customerId,
  paymentMethod,
  description,
}) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: currency,
    customer: customerId,
    payment_method: paymentMethod,
    description: description ? description : "",
    setup_future_usage: "on_session",
  });
  return paymentIntent;
};

const getPaymentIntentFromStripe = async (paymentIntetntId) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntetntId);
  return paymentIntent;
};

const updatePaymentIntentInStripe = async (paymentIntentId, metadata) => {
  const paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
    metadata: {
      ...metadata,
    },
  });
  return paymentIntent;
};

const confirmPaymentIntentInStripe = async ({
  paymentIntentId,
  paymentMethod,
}) => {
  const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
    payment_method: paymentMethod,
    // payment_method: "pm_1QynpaSHpKyhkVYhg975EiCZ",
    return_url: "https://www.youtube.com",
  });
  return paymentIntent;
};

const cancelPaymentIntentInStripe = async (paymentIntentId) => {
  const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
  return paymentIntent;
};

const createSubscriptionInStripe = async (
  paymentMethodId,
  customerId,
  price,
  cancelAt
) => {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: price,
    default_payment_method: paymentMethodId,
    collection_method: common.SUBSCRIPTION.COLLECTION_METHOD,
    cancel_at: cancelAt,
    expand: ["latest_invoice"],
  });
  return subscription;
};

const pauseSubscriptionInStripe = async (subscriptionId) => {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    pause_collection: {
      behavior: common.PAUSE_COLLECTION_TYPE.MARK_UNCOLLECTIBLE,
    },
  });
  return subscription;
};

const updateSubscriptionInStripe = async (subscriptionId, metadata) => {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    metadata: {
      ...metadata,
    },
  });
  return subscription;
};

const resetSubscriptionTimeInStripe = async (subscriptionId) => {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    billing_cycle_anchor: "now",
    proration_behavior: "create_prorations",
  });
  return subscription;
};

const setAutoCollectionOfInvoiceInStripe = async (invoiceId) => {
  const invoice = await stripe.invoices.update(invoiceId, {
    auto_advance: true,
  });
  return invoice;
};

const payInvoiceInStripe = async (invoiceId) => {
  const invoice = await stripe.invoices.pay(invoiceId);
  return invoice;
};

const updatePaymentMethodOfSubscriptionInStripe = async (
  subscriptionId,
  paymentMethodId
) => {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    default_payment_method: paymentMethodId,
  });
  return subscription;
};

const resumeSubscriptionInStripe = async (subscriptionId) => {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    pause_collection: "",
  });
  // const subscription = await stripe.subscriptions.resume(subscriptionId, {
  //   proration_behavior: "always_invoice",
  // });
  return subscription;
};

const getSubscriptionBySubscriptionIdInStripe = async (subscriptionId) => {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
};

const cancelSubscriptionInStripe = async (subscriptionId, reason) => {
  const subscription = await stripe.subscriptions.cancel(subscriptionId, {
    cancellation_details: {
      feedback: reason,
    },
  });
  return subscription;
};

const getInvoiceByIdFromStripe = async (invoiceId) => {
  const invoice = await stripe.invoices.retrieve(invoiceId);
  return invoice;
};

const constructWebhookInStripe = async ({
  rowData,
  signature,
  endpointSecret,
}) => {
  const event = stripe.webhooks.constructEvent(
    rowData,
    signature,
    endpointSecret
  );
  return event;
};

// const getUpcomingInvoiceOfCustomer = async (subscription) => {
//   const invoice = await stripe.invoices.retrieveUpcoming({ subscription });
//   return invoice;
// };

export default {
  createCustomerInStripe,
  getCustomerFromStripe,
  setDefaultPaymenteMethodToCustomerInStripe,
  createProductInStripe,
  updateProductNameInStripe,
  createPriceInStripe,
  updatePriceInStripe,
  deletePriceInStripe,
  deleteProductInStripe,
  createTokenForPaymenthodInStripe,
  createPaymentMethodInStripe,
  attachCustomerToPaymentMethodInStripe,
  updatePaymentMethodInStripe,
  getPaymentMethodOfUserFromStripe,
  getPaymentMethodInStripe,
  detachPaymentMethodInStripe,
  createPaymentIntentInStripe,
  getPaymentIntentFromStripe,
  updatePaymentIntentInStripe,
  confirmPaymentIntentInStripe,
  cancelPaymentIntentInStripe,
  createSubscriptionInStripe,
  pauseSubscriptionInStripe,
  resumeSubscriptionInStripe,
  updateSubscriptionInStripe,
  resetSubscriptionTimeInStripe,
  setAutoCollectionOfInvoiceInStripe,
  payInvoiceInStripe,
  updatePaymentMethodOfSubscriptionInStripe,
  cancelSubscriptionInStripe,
  getSubscriptionBySubscriptionIdInStripe,
  getInvoiceByIdFromStripe,
  constructWebhookInStripe,
  // getUpcomingInvoiceOfCustomer,
};
