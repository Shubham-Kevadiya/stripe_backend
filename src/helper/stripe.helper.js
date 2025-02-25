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
        common.STRIPE_TEST_CARD[
          Object.keys(common.STRIPE_TEST_CARD)[
            Math.floor(
              Math.random() * Object.keys(common.STRIPE_TEST_CARD).length
            )
          ]
        ],
    },
    billing_details: paymentMethodData,
  });
  console.log({
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
    },
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

const getPaymentMethodInStripe = async (paymentMethodId) => {
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
  return paymentMethod;
};

const detachPaymentMethodInStripe = async (paymentMethodId) => {
  const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);
  return paymentMethod;
};

export default {
  createCustomerInStripe,
  createPriceInStripe,
  updatePriceInStripe,
  deleteProductInStripe,
  createPaymentMethodInStripe,
  attachCustomerToPaymentMethodInStripe,
  updatePaymentMethodInStripe,
  getPaymentMethodInStripe,
  detachPaymentMethodInStripe,
};
