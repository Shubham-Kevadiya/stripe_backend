import { ProductModel } from "../model/product.model.js";

const saveProduct = async (productData) => {
  const product = await new ProductModel(productData).save();
  return product;
};

const getAllProduct = async (page, limit) => {
  const products = await ProductModel.find()
    .skip(page ? page - 1 : 1 * limit ? limit : 10)
    .limit(limit ? limit : 10);
  return products;
};

const getProductById = async (productId) => {
  const product = await ProductModel.findById(productId);
  return product;
};

const updateProductById = async (productData) => {
  const product = await ProductModel.findByIdAndUpdate(
    productData.productId,
    {
      ...productData,
    },
    { new: true }
  );
  return product;
};

const deleteProductById = async (productId) => {
  await ProductModel.findByIdAndDelete(productId);
  return "product deleted successsfully !";
};

export default {
  saveProduct,
  getAllProduct,
  getProductById,
  updateProductById,
  deleteProductById,
};
