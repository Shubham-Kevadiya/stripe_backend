import paymentIntentService from './paymentIntent.service.js';

const createPaymentIntent = async (req, res, next) => {
  try {
    const payloadValue = req.body;
    const userId = req.session.userId;
    const paymentIntent = await paymentIntentService.createPaymentIntent({
      ...payloadValue,
      userId,
    });
    return res.status(200).json({
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log('error', 'error in create paymentIntent', error);
    next(error);
  }
};

const confirmPaymentIntent = async (req, res, next) => {
  try {
    const paymentIntentId = req.params.paymentIntentId;
    const userId = req.session.userId;
    const payloadValue = req.body;
    const paymentIntent = await paymentIntentService.confirmPaymentIntent({
      paymentMethod: payloadValue.paymentMethod,
      paymentIntentId,
      userId,
    });
    // return res
    //   .status(200)
    //   .redirect(paymentIntent.next_action.redirect_to_url.url);
    return res.status(200).json({ paymentIntent });
  } catch (error) {
    console.log('error', 'error in confirm paymentIntent', error);
    next(error);
  }
};

export default {
  createPaymentIntent,
  confirmPaymentIntent,
};
