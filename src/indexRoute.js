import express from "express";
import userRoute from "./components/auth/auth.route.js";
import productRoute from "./components/product/product.route.js";
import paymentMethodRoute from "./components/paymentMethod/paymentMethod.route.js";
import paymentIntentRoute from "./components/paymentIntent/paymentIntent.route.js";
import webhookRoute from "./components/webhook/webhook.route.js";
import purchaseRoute from "./components/purchase/purchase.route.js";
import subscriptionRoute from "./components/subscription/subscription.route.js";
import promocodeRoute from "./components/promocode/promocode.route.js";

const apiRoute = express.Router();

apiRoute.use("/users", userRoute);
apiRoute.use("/plans", productRoute);
apiRoute.use("/paymentMethods", paymentMethodRoute);
apiRoute.use("/one-time", paymentIntentRoute);
apiRoute.use("/subscriptions", subscriptionRoute);
apiRoute.use("/purchases", purchaseRoute);
apiRoute.use("/promocodes", promocodeRoute);
apiRoute.use("/webhook", webhookRoute);

export default apiRoute;
