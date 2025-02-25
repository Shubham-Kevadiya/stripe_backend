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
  const product = await getProductById(productData.productId);
  if (!product) {
    console.log("product not found");
    throw new Error("NOT_FOUND");
  }
  const updatedProduct = await ProductModel.findByIdAndUpdate(
    productData.productId,
    {
      ...productData,
    },
    { new: true }
  );
  return updatedProduct;
};

const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  if (!product) {
    console.log("product not found");
    throw new Error("NOT_FOUND");
  }
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
