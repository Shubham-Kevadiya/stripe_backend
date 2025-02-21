import express from "express";
import authController from "./auth.controller.js";
import authValidateSchema from "./auth.validate.js";
import authValidation from "../../middleware/validation.js";
const userRoute = express.Router();

userRoute.post(
  "/register",
  authValidation.validateBodySchema(authValidateSchema.registerSchema),
  authController.register
);
userRoute.post(
  "/login",
  authValidation.validateBodySchema(authValidateSchema.loginSchema),
  authController.login
);

export default userRoute;
