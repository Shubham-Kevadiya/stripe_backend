import Stripe from "stripe";
import config from "../config/config.js";
import common from "../constants/common.js";

const stripe = Stripe(config.stipe.secret_key);

const createCustomerInStripe = async (customerData) => {
  const customer = await stripe.customers.create({
    name: customerData.name,
    email: customerData.email,
  });
  return customer;
};

const createPriceInStripe = async (productData) => {
  let data;
  if (productData.name) {
    data = {
      currency: productData.currency,
      unit_amount: productData.price * 100,
      product_data: {
        name: productData.name,
      },
    };
  } else {
    data = {
      currency: productData.currency,
      unit_amount: productData.price * 100,
      product: productData.product,
    };
  }
  const price = await stripe.prices.create(data);
  return price;
};

const updatePriceInStripe = async (priceId, status) => {
  await stripe.prices.update(priceId, {
    active: status,
  });
  return "Price updated successfully";
};

const deleteProductInStripe = async (productId) => {
  await stripe.products.del(productId);
  return "Product deleted successfully";
};

const createPaymentMethodInStripe = async (paymentMethodData) => {
  const paymentMethod = await stripe.paymentMethods.create({
    type: common.TYPE,
    card: {
      token:
        // common.STRIPE_TEST_CARD[
        //   Object.keys(common.STRIPE_TEST_CARD)[
        //     Math.floor(
        //       Math.random() * Object.keys(common.STRIPE_TEST_CARD).length
        //     )
        //   ]
        // ],
        "tok_chargeCustomerFail",
    },
    billing_details: paymentMethodData,
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
}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency || "usd",
      customer: customerId,
      payment_method: paymentMethod,
    });
    return paymentIntent;
  } catch (error) {
    console.log({ error });
  }
};

const confirmPaymentIntentInStripe = async ({
  paymentIntentId,
  // paymentMethod,
}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: "pm_1Qx0hnSHpKyhkVYhV73baOOl",
      // payment_method: "pm_1QwFjkSHpKyhkVYhs56ZuEAq",
      return_url: "https://www.youtube.com",
    });
    return paymentIntent;
  } catch (error) {
    console.log({ error });
  }
};

const cancelPaymentIntentInStripe = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.log({ error });
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
    console.log({ error });
  }
};

export default {
  createCustomerInStripe,
  createPriceInStripe,
  updatePriceInStripe,
  deleteProductInStripe,
  createPaymentMethodInStripe,
  attachCustomerToPaymentMethodInStripe,
  updatePaymentMethodInStripe,
  getPaymentMethodOfUserFromStripe,
  getPaymentMethodInStripe,
  detachPaymentMethodInStripe,
  createPaymentIntentInStripe,
  confirmPaymentIntentInStripe,
  cancelPaymentIntentInStripe,
  constructWebhookInStripe,
};
