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
  "/update/:productId",
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

  productController.getProductById
);
productRoute.delete(
  "/:productId",

  productController.deleteProduct
);

export default productRoute;
