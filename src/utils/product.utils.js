import { ProductModel } from '../model/product.model.js';

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
  const product = await ProductModel.findById(productId).lean();
  return product;
};

const getProductByName = async (productName) => {
  const product = await ProductModel.findOne({ name: productName });
  return product;
};

const updateProductById = async (productData) => {
  const product = await getProductById(productData.productId);
  if (!product) {
    console.log('product not found');
    throw new Error('RESOURCE_NOT_FOUND');
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
    console.log('product not found');
    throw new Error('NOT_FOUND');
  }
  await ProductModel.findByIdAndDelete(productId);
  return 'product deleted successsfully !';
};

const countDocuments = async (query) => {
  const documents = await ProductModel.countDocuments(query);
  return documents;
};

export default {
  saveProduct,
  getAllProduct,
  getProductById,
  getProductByName,
  updateProductById,
  deleteProductById,
  countDocuments,
};
