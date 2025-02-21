import express from "express";
import productValidate from "../../middleware/validation.js";
import productValidateSchema from "./product.validate.js";
import productController from "./product.controller.js";

const productRoute = express.Router();

productRoute.post(
  "/create",
  productValidate.validateBodySchema(productValidateSchema.createProductSchema),
  productController.createProduct
);
productRoute.post(
  "/update",
  productValidate.validateBodySchema(productValidateSchema.updateProductSchema),
  productController.updateProduct
);
productRoute.get(
  "/",
  productValidate.validateQuerySchema(productValidateSchema.getProductSchema),
  productController.getAllProduct
);
productRoute.get(
  "/:productId",
  productValidate.validateParamSchema(
    productValidateSchema.getProductByIdSchema
  ),
  productController.getProductById
);
productRoute.delete(
  "/:productId",
  productValidate.validateParamSchema(
    productValidateSchema.deleteProductByIdSchema
  ),
  productController.deleteProduct
);

export default productRoute;
