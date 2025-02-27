import paymentIntentService from "./paymentIntent.service.js";

const createPaymentIntent = async (req, res, next) => {
  try {
    const payloadValue = req.body;
    const userId = req.session.userId;
    const paymentIntent = await paymentIntentService.createPaymentIntent({
      ...payloadValue,
      userId,
    });
    return res.status(200).json({ clientSecret: paymentIntent.clientSecret });
  } catch (error) {
    console.log("error", "error in create paymentIntent", error);
    next(error);
  }
};

const confirmPaymentIntent = async (req, res, next) => {
  try {
    const paymentIntentId = req.params.paymentIntentId;
    const userId = req.session.userId;
    const paymentIntent = await paymentIntentService.confirmPaymentIntent({
      paymentIntentId,
      userId,
    });
    return res.status(200).json({ paymentIntent });
  } catch (error) {
    console.log("error", "error in confirm paymentIntent", error);
    next(error);
  }
};

export default {
  createPaymentIntent,
  confirmPaymentIntent,
};
