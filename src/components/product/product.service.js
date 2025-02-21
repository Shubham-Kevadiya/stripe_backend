import Stripe from "stripe";
import productUtils from "../../utils/product.utils.js";
import { ProductModel } from "../../model/product.model.js";
import config from "../../config/config.js";

const createProduct = async (productData) => {
  try {
    const stripe = Stripe(config.stipe.secret_key);
    const price = await stripe.prices.create({
      currency: productData.currency,
      unit_amount: productData.price * 100,
      product_data: {
        name: productData.name,
      },
    });
    const product = await productUtils.saveProduct(
      new ProductModel({
        ...productData,
        price: productData.price,
        product_id: price.product,
        price_id: price.id,
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
    const product = await productUtils.updateProductById(productData);
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
    if (!product) {
      console.log("product not found");
      throw new Error("NOT_FOUND");
    }
    delete product.price_id;
    delete product.product_id;
    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteProduct = async (productId) => {
  try {
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
