import Stripe from 'stripe';
import config from '../config/config.js';
import common from '../constants/common.js';

const stripe = Stripe(config.stipe.secret_key, {
  maxNetworkRetries: 2,
});

// customer
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

// product

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

const deleteProductInStripe = async (productId) => {
  await stripe.products.del(productId);
  return 'Product deleted successfully';
};

//price

const createPriceInStripe = async (productData) => {
  const price = await stripe.prices.create(productData);
  return price;
};

const updatePriceInStripe = async (priceId, status) => {
  await stripe.prices.update(priceId, {
    active: status,
  });
  return 'Price updated successfully';
};

const deletePriceInStripe = async (priceId, status) => {
  await stripe.prices.update(priceId, {
    active: status,
  });
  return 'Price updated successfully';
};

// const createTokenForPaymenthodInStripe = async (cardData) => {
//   const token = await stripe.tokens.create({
//     card: cardData,
//   });
//   return token;
// };

// payment method

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

// payment intent

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
    description: description ? description : '',
    setup_future_usage: 'on_session',
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
    return_url: 'https://www.youtube.com',
  });
  return paymentIntent;
};

const cancelPaymentIntentInStripe = async (paymentIntentId) => {
  const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
  return paymentIntent;
};

// subscription

const createSubscriptionInStripe = async (
  paymentMethodId,
  customerId,
  price,
  cancelAt,
  stripePromocodeId
) => {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: price,
    default_payment_method: paymentMethodId,
    collection_method: common.SUBSCRIPTION.COLLECTION_METHOD,
    cancel_at: cancelAt,
    expand: ['latest_invoice'],
    promotion_code: stripePromocodeId,
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

const removePromocodeFromSubscriptionInStripe = async (subscriptionId) => {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    promotion_code: '',
  });
  return subscription;
};

const resetSubscriptionTimeInStripe = async (subscriptionId) => {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    billing_cycle_anchor: 'now',
    proration_behavior: 'create_prorations',
  });
  return subscription;
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
    pause_collection: '',
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

// invoice

const setAutoCollectionOfInvoiceInStripe = async (invoiceId) => {
  const invoice = await stripe.invoices.update(invoiceId, {
    auto_advance: true,
  });
  return invoice;
};

const getInvoiceByIdFromStripe = async (invoiceId) => {
  const invoice = await stripe.invoices.retrieve(invoiceId);
  return invoice;
};

const constructWebhookInStripe = ({ rowData, signature, endpointSecret }) => {
  const event = stripe.webhooks.constructEvent(
    rowData,
    signature,
    endpointSecret
  );
  return event;
};

// coupen

const createCoupenInStripe = async (
  stripeCoupenName,
  currency,
  duration,
  durationInMonths,
  discountInAmount,
  discountInPercentage,
  plan,
  maxRedumption
) => {
  const obj = {
    name: stripeCoupenName,
    currency,
    duration,
    duration_in_months: durationInMonths != 0 ? durationInMonths : null,
    // amount_off:
    //   discountInAmount && discountInAmount != 0 ? discountInAmount : 0,
    // percent_off:
    //   discountInPercentage && discountInPercentage != 0
    //     ? discountInPercentage
    //     : null,
    max_redemptions: maxRedumption,
  };
  if (plan.length > 0) {
    obj.applies_to = {
      products: plan,
    };
  }
  if (discountInPercentage) {
    obj.percent_off = discountInPercentage;
  } else {
    obj.amount_off = discountInAmount;
  }
  const coupen = await stripe.coupons.create(obj);
  return coupen;
};

const updateCoupenInStripe = async (coupenId, coupenName) => {
  const coupen = await stripe.coupons.update(coupenId, {
    name: coupenName,
  });
  return coupen;
};

const deleteCoupenInStripe = async (coupenId) => {
  await stripe.coupons.del(coupenId);
  return 'coupen deleted successfully';
};

// promocode

const createPromocodeInStripe = async (
  coupenId,
  promocode,
  specificCustomer,
  maxRedumption,
  minAmount,
  currency
) => {
  const createdPromocode = await stripe.promotionCodes.create({
    coupon: coupenId,
    code: promocode,
    customer: specificCustomer != '' ? specificCustomer : null,
    max_redemptions: maxRedumption,
    restrictions: {
      minimum_amount: minAmount,
      minimum_amount_currency: currency,
    },
  });
  return createdPromocode;
};

const getpromocodeFromStripe = async (promocodeId) => {
  const promocode = await stripe.promotionCodes.retrieve(promocodeId);
  return promocode;
};

const updatepromocodeInStripe = async (promocodeId, isActive) => {
  const promocode = await stripe.promotionCodes.update(promocodeId, {
    active: isActive,
  });
  return promocode;
};

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
  removePromocodeFromSubscriptionInStripe,
  resetSubscriptionTimeInStripe,
  setAutoCollectionOfInvoiceInStripe,
  payInvoiceInStripe,
  updatePaymentMethodOfSubscriptionInStripe,
  cancelSubscriptionInStripe,
  getSubscriptionBySubscriptionIdInStripe,
  getInvoiceByIdFromStripe,
  constructWebhookInStripe,
  createCoupenInStripe,
  updateCoupenInStripe,
  deleteCoupenInStripe,
  createPromocodeInStripe,
  getpromocodeFromStripe,
  updatepromocodeInStripe,
};
