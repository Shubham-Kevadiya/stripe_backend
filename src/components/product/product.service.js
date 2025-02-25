import productUtils from "../../utils/product.utils.js";
import { ProductModel } from "../../model/product.model.js";
import stripeHelper from "../../helper/stripe.helper.js";

const createProduct = async (productData) => {
  try {
    const price = await stripeHelper.createPriceInStripe(productData);
    const product = await productUtils.saveProduct(
      new ProductModel({
        ...productData,
        price: productData.price,
        stripeProductId: price.product,
        priceId: price.id,
        currency: productData.currency,
      })
    );
    delete product.priceId;
    delete product.productIid;
    return product;
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
    if (productData.price || productData.currency) {
      const price = await stripeHelper.createPriceInStripe({
        currency: productData.currency
          ? productData.currency
          : existingProduct.currency,
        price: productData.price
          ? productData.price * 100
          : existingProduct.price,
        product: existingProduct.stripeProductId,
      });
      await stripeHelper.updatePriceInStripe(existingProduct.priceId, false);
      productData.priceId = price.id;
      productData.stripeProductId = existingProduct.stripeProductId;
    }
    const product = await productUtils.updateProductById(productData);
    delete product.priceId;
    delete product.stripeProductId;
    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getProducts = async (page, limit) => {
  try {
    const product = await productUtils.getAllProduct(page, limit);
    delete product.priceId;
    delete product.productId;
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
    delete product.priceId;
    delete product.productId;
    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteProduct = async (productId) => {
  try {
    const existingProduct = await productUtils.getProductById(productId);
    await stripeHelper.updatePriceInStripe(existingProduct.priceId, false);
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
