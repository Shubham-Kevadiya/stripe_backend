import paymentMethodService from './paymentMethod.service.js';

export const createPaymentMethod = async (req, res, next) => {
  try {
    const payloadValue = req.body;
    const userId = req.session.userId;
    const user = await paymentMethodService.createPaymentMethod(
      payloadValue,
      userId
    );
    return res.status(200).json(user);
  } catch (error) {
    console.log('error', 'error in create payment method', error);
    next(error);
  }
};

export const updatePaymentMethod = async (req, res, next) => {
  try {
    const payloadValue = req.body;
    const userId = req.session.userId;
    const paymentMethodId = req.params.paymentMethodId;
    const user = await paymentMethodService.updatePaymentMethodOfUser(
      payloadValue,
      paymentMethodId,
      userId
    );
    return res.status(200).json(user);
  } catch (error) {
    console.log('error', 'error in update payment method', error);
    next(error);
  }
};

export const setDefaultPaymentMethod = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const paymentMethodId = req.params.paymentMethodId;
    const user = await paymentMethodService.setDefaultPaymentMethod(
      userId,
      paymentMethodId
    );
    return res.status(200).json(user);
  } catch (error) {
    console.log('error', 'error in set default payment method', error);
    next(error);
  }
};

export const getPaymentMethodOfUser = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const limit = req.query.limit || 10;
    const paymentMethodOfUser =
      await paymentMethodService.getPaymentMethodOfUser(userId, limit);
    return res.status(200).json({
      paymentMethod: paymentMethodOfUser.data.data,
      has_more: paymentMethodOfUser.hasMore,
    });
  } catch (error) {
    console.log('error', 'error in get payment method of user', error);
    next(error);
  }
};

export const getPaymentMethodFromStripeById = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const paymentMethodId = req.params.paymentMethodId;
    const paymentMethodOfUser =
      await paymentMethodService.getPaymentMethodByPaymentMethodId(
        userId,
        paymentMethodId
      );
    return res.status(200).json(paymentMethodOfUser);
  } catch (error) {
    console.log('error', 'error in get payment method of user', error);
    next(error);
  }
};

export const deletePaymentMethodById = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const paymentMethodId = req.params.paymentMethodId;
    await paymentMethodService.deletePaymentMethodByPaymentMethodId(
      userId,
      paymentMethodId
    );
    return res.status(200).json({ msg: 'Payment Method deleted successfully' });
  } catch (error) {
    console.log('error', 'error in get payment method of user', error);
    next(error);
  }
};
