import express from 'express';
import productValidate from '../../middleware/validation.js';
import productValidateSchema from './product.validate.js';
import productController from './product.controller.js';
import authenticateUser from '../../middleware/authenticateUser.js';

const productRoute = express.Router();

productRoute.post(
  '/create',
  authenticateUser.validateAuthIdToken,
  // authenticateUser.validateIsAdmin,
  productValidate.validateBodySchema(productValidateSchema.createProductSchema),
  productController.createProduct
);
productRoute.put(
  '/update/:productId',
  authenticateUser.validateAuthIdToken,
  productValidate.validateBodySchema(productValidateSchema.updateProductSchema),
  productController.updateProduct
);
productRoute.get(
  '/',
  authenticateUser.validateAuthIdToken,
  productController.getAllProduct
);
productRoute.get(
  '/:productId',
  authenticateUser.validateAuthIdToken,
  productController.getProductById
);

// productRoute.get(
//   "/type/:type",
//   authenticateUser.validateAuthIdToken,
//   productController.getProductById
// );

productRoute.delete(
  '/:productId',
  authenticateUser.validateAuthIdToken,
  authenticateUser.validateIsAdmin,
  productController.deleteProduct
);

export default productRoute;
