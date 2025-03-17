import productService from './product.service.js';

const createProduct = async (req, res, next) => {
  try {
    const payloadValue = req.body;
    const product = await productService.createProduct(payloadValue);
    return res.status(200).json(product);
  } catch (error) {
    console.log('error', 'error in create product', error);
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const payloadValue = req.body;
    const productId = req.params.productId;
    const updatedProduct = await productService.updateProduct({
      ...payloadValue,
      productId,
    });
    return res.status(200).json({ updatedProduct });
  } catch (error) {
    console.log('error', 'error in update product', error);
    next(error);
  }
};

const getAllProduct = async (req, res, next) => {
  try {
    const page = req.query.page;
    const limit = req.query.limit;
    const product = await productService.getProducts(page, limit);
    return res.status(200).json({ product });
  } catch (error) {
    console.log('error', 'error in get all product', error);
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const product = await productService.getProductById(productId);
    return res.status(200).json({ product });
  } catch (error) {
    console.log('error', 'error in get product by id', error);
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    await productService.deleteProduct(productId);
    return res.status(200).json({ msg: 'product deleted successfully' });
  } catch (error) {
    console.log('error', 'error in delete product', error);
    next(error);
  }
};

export default {
  createProduct,
  updateProduct,
  getAllProduct,
  getProductById,
  deleteProduct,
};
