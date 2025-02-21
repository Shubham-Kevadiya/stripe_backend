import Stripe from "stripe";
import productUtils from "../../utils/product.utils.js";
import { ProductModel } from "../../model/product.model.js";

const createProduct = async (productData) => {
  try {
    const stripe = Stripe(config.stipe.secret_key);
    const price = await stripe.prices.create({
      currency: productData.currency * 100,
      unit_amount: productData.amount,
      product_data: {
        name: productData.name,
      },
    });
    const product = await saveProduct(
      new ProductModel({
        ...productData,
        currency: productData.currency * 100,
        product_id: price.product,
        price_id: price.is,
      })
    );
    delete product.price_id;
    delete product.product_id;
    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateProduct = async (productData) => {
  try {
    const product = await productUtils.updateProductById(
      productData._id,
      productData
    );
    delete product.price_id;
    delete product.product_id;
    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getProducts = async (page, limit) => {
  try {
    const product = await productUtils.getAllProduct(page, limit);
    delete product.price_id;
    delete product.product_id;
    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getProductById = async (productId) => {
  try {
    const product = await productUtils.getProductById(productId);
    delete product.price_id;
    delete product.product_id;
    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteProduct = async (productId) => {
  try {
    await productUtils.deleteProduct(productId);
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
