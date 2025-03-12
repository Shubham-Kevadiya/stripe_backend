import express from "express";
import promocodeValidate from "../../middleware/validation.js";
import promocodeValidateSchema from "./promocode.validate.js";
import promocodeController from "./promocode.controller.js";
import authenticateUser from "../../middleware/authenticateUser.js";

const promocodeRoute = express.Router();

promocodeRoute.post(
  "/create",
  authenticateUser.validateAuthIdToken,
  promocodeValidate.validateBodySchema(
    promocodeValidateSchema.createPromocodeSchema
  ),
  promocodeController.createPromocode
);
promocodeRoute.get(
  "/",
  authenticateUser.validateAuthIdToken,
  promocodeController.getAllPromocode
);
promocodeRoute.post(
  "/active/:type",
  authenticateUser.validateAuthIdToken,
  promocodeValidate.validateBodySchema(
    promocodeValidateSchema.getActivePromocodeAccordingToPlanSchema
  ),
  promocodeController.getActivePromocodeAccordingToPlan
);
promocodeRoute.get(
  "/:promocodeId",
  authenticateUser.validateAuthIdToken,
  promocodeController.getPromocodeById
);

promocodeRoute.put(
  "/update/:promocodeId",
  authenticateUser.validateAuthIdToken,
  promocodeValidate.validateBodySchema(
    promocodeValidateSchema.updatePromocodeSchema
  ),
  promocodeController.updatePromocodeById
);
promocodeRoute.delete(
  "/delete/:promocodeId",
  authenticateUser.validateAuthIdToken,
  promocodeValidate.validateBodySchema(
    promocodeValidateSchema.deletePromocodeSchema
  ),
  promocodeController.deletePromocodeById
);

export default promocodeRoute;
