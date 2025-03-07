import productUtils from "../../utils/product.utils.js";
import stripeHelper from "../../helper/stripe.helper.js";

const createProduct = async (productData) => {
  try {
    const existingProduct = await productUtils.getProductByName(
      productData.name
    );
    if (existingProduct) {
      console.log("Error from create product, product name repeated");
      throw new Error("PRODUCT_ALREADY_EXIST");
    }
    let oneTimePriceArr = [];
    let recurringPriceArr = [];
    const product = await stripeHelper.createProductInStripe(productData.name);
    if (productData.oneTimePrice) {
      for await (const price of productData.oneTimePrice) {
        const oneTimePrice = await stripeHelper.createPriceInStripe({
          currency: productData.currency,
          unit_amount: price.amount * 100,
          product: product.id,
        });
        oneTimePriceArr.push({
          stripePriceId: oneTimePrice.id,
          interval: price.interval,
          price: price.amount,
        });
      }
    }
    if (productData.subscriptionPrice) {
      for await (const price of productData.subscriptionPrice) {
        const recurringPrice = await stripeHelper.createPriceInStripe({
          currency: productData.currency,
          unit_amount: price.amount * 100,
          product: product.id,
          recurring: {
            interval: price.interval,
          },
        });
        recurringPriceArr.push({
          stripePriceId: recurringPrice.id,
          interval: price.interval,
          price: price.amount,
        });
      }
    }

    const savedProduct = await productUtils.saveProduct({
      name: productData.name,
      stripeProductId: product.id,
      currency: productData.currency,
      stripePriceForOneTime: oneTimePriceArr,
      stripePriceForRecurring: recurringPriceArr,
    });
    delete savedProduct.stripePriceForOneTime;
    delete savedProduct.stripePriceForRecurring;
    return savedProduct;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateProduct = async (productData) => {
  try {
    const existingProduct = await productUtils.getProductById(
      productData.productId
    );
    if (!existingProduct) {
      console.log("Product not found to update");
      throw new Error("RESOURCE_NOT_FOUND");
    }
    if (productData.name) {
      const productWithSameName = await productUtils.getProductByName(
        productData.name
      );
      if (
        productWithSameName &&
        productWithSameName._id.toString() != existingProduct._id.toString()
      ) {
        console.log("Error from update product, product name repeated");
        throw new Error("PRODUCT_NAME_ALREADY_EXIST");
      }
    }
    let oneTimePriceArr = [];
    let recurringPriceArr = [];
    if (productData.oneTimePrice && productData.oneTimePrice.length > 0) {
      for (let i = 0; i < existingProduct.stripePriceForOneTime.length; i++) {
        await stripeHelper.deletePriceInStripe(
          existingProduct.stripePriceForOneTime[i].stripePriceId,
          false
        );
      }
      for await (const price of productData.oneTimePrice) {
        const oneTimePrice = await stripeHelper.createPriceInStripe({
          currency: productData.currency
            ? productData.currency
            : existingProduct.currency,
          unit_amount: price.amount * 100,
          product: existingProduct.stripeProductId,
        });
        oneTimePriceArr.push({
          stripePriceId: oneTimePrice.id,
          interval: price.interval,
          price: price.amount,
        });
      }
    }

    if (
      productData.subscriptionPrice &&
      productData.subscriptionPrice.length > 0
    ) {
      for (let i = 0; i < existingProduct.stripePriceForRecurring.length; i++) {
        await stripeHelper.deletePriceInStripe(
          existingProduct.stripePriceForRecurring[i].stripePriceId,
          false
        );
      }
      for await (const price of productData.subscriptionPrice) {
        const recurringPrice = await stripeHelper.createPriceInStripe({
          currency: productData.currency
            ? productData.currency
            : existingProduct.currency,
          unit_amount: price.amount * 100,
          product: existingProduct.stripeProductId,
          recurring: {
            interval: price.interval,
          },
        });
        recurringPriceArr.push({
          stripePriceId: recurringPrice.id,
          interval: price.interval,
          price: price.amount,
        });
      }
    }

    if (productData.name) {
      await stripeHelper.updateProductNameInStripe(
        existingProduct.stripeProductId,
        productData.name
      );
    }
    const product = await productUtils.updateProductById({
      name: productData.name ? productData.name : existingProduct.name,
      productId: existingProduct._id,
      currency: productData.currency
        ? productData.currency
        : existingProduct.currency,
      stripePriceForOneTime:
        productData.price || productData.currency
          ? oneTimePriceArr
          : existingProduct.stripePriceForOneTime,
      stripePriceForRecurring:
        productData.price || productData.currency
          ? recurringPriceArr
          : existingProduct.stripePriceForRecurring,
    });
    return product;
  } catch (error) {
    console.log("Error from update product", { error });
    throw new Error(error.message);
  }
};

const getProducts = async (page, limit) => {
  try {
    const product = await productUtils.getAllProduct(page, limit);
    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getProductById = async (productId) => {
  try {
    const product = await productUtils.getProductById(productId);
    if (!product) {
      console.log("product not found");
      throw new Error("NOT_FOUND");
    }
    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteProduct = async (productId) => {
  try {
    const existingProduct = await productUtils.getProductById(productId);
    if (!existingProduct) {
      console.log("Product not found to delete");
      throw new Error("RESOURCE_NOT_FOUND");
    }
    for (let i = 0; i < existingProduct.stripePriceForOneTime.length; i++) {
      await stripeHelper.deletePriceInStripe(
        existingProduct.stripePriceForOneTime[i].stripePriceId,
        false
      );
      await stripeHelper.deletePriceInStripe(
        existingProduct.stripePriceForRecurring[i].stripePriceId,
        false
      );
    }
    await stripeHelper.deleteProductInStripe(existingProduct.productId);
    await productUtils.deleteProductById(productId);
    return "Product Deleted Successfully";
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
  createProduct,
  updateProduct,
  getProducts,
  getProductById,
  deleteProduct,
};
