import express from "express";
import purchaseController from "./purchase.controller.js";
import validation from "../../middleware/validation.js";
import purchaseValidate from "./purchase.validate.js";
import authenticateUser from "../../middleware/authenticateUser.js";

const purchaseRoute = express.Router();

purchaseRoute.post(
  "/create",
  authenticateUser.validateAuthIdToken,
  validation.validateBodySchema(purchaseValidate.createPurchaseSchema),
  purchaseController.createPurchase
);

export default purchaseRoute;
