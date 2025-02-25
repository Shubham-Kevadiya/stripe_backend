import express from "express";
import userRoute from "./components/auth/auth.route.js";
import productRoute from "./components/product/product.route.js";
import paymentMethodRoute from "./components/paymentMethod/paymentMethod.route.js";

const apiRoute = express.Router();

apiRoute.use("/user", userRoute);
apiRoute.use("/product", productRoute);
apiRoute.use("/paymentMethod", paymentMethodRoute);

export default apiRoute;
