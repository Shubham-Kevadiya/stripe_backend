import subscriptionService from './subscription.service.js';

const createSubscription = async (req, res, next) => {
  try {
    const payloadValue = req.body;
    const userId = req.session.userId;
    const subscription = await subscriptionService.createSubscription({
      ...payloadValue,
      userId,
    });
    return res.status(200).json({
      subscription: {
        id: subscription.id,
        invoice: subscription.latest_invoice,
      },
    });
  } catch (error) {
    console.log('error', 'error in create subscription', error);
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const payloadValue = req.body;
    const userId = req.session.userId;
    const subscriptionId = req.params.subscriptionId;
    await subscriptionService.updateSubscription({
      ...payloadValue,
      subscriptionId,
      userId,
    });
    return res.status(200).json({
      msg: 'Payment method updated successfully in subscription',
    });
  } catch (error) {
    console.log('error', 'error in update subscription', error);
    next(error);
  }
};

const pauseSubscription = async (req, res, next) => {
  try {
    const payloadValue = req.body;
    const userId = req.session.userId;
    const stripeSubscriptionId = req.params.subscriptionId;
    await subscriptionService.pauseSubscription({
      ...payloadValue,
      userId,
      stripeSubscriptionId,
    });
    return res.status(200).json({ msg: 'subscription pause successfully' });
  } catch (error) {
    console.log('error', 'error in pause subscription', error);
    next(error);
  }
};

const resumeSubscription = async (req, res, next) => {
  try {
    const payloadValue = req.body;
    const userId = req.session.userId;
    const subscriptionId = req.params.subscriptionId;
    const invoiceToPay = await subscriptionService.resumeSubscription({
      ...payloadValue,
      userId,
      subscriptionId,
    });
    return res.status(200).json({
      msg: 'subscription resume successfully',
      url: invoiceToPay ? invoiceToPay : '',
    });
  } catch (error) {
    console.log('error', 'error in resume subscription', error);
    next(error);
  }
};

const cancelSubscription = async (req, res, next) => {
  try {
    const payloadValue = req.body;
    const userId = req.session.userId;
    const subscriptionId = req.params.subscriptionId;
    await subscriptionService.cancelSubscription({
      ...payloadValue,
      userId,
      subscriptionId,
    });
    return res.status(200).json({ msg: 'Subscription canceled successfully' });
  } catch (error) {
    console.log('error', 'error in cancel subscription', error);
    next(error);
  }
};

// const getUpcomingInvoiceOfCustomer = async (req, res, next) => {
//   try {
//     const subscription = req.params.subscriptionId;
//     const invoice = await stripeHelper.getUpcomingInvoiceOfCustomer(
//       subscription
//     );
//     return res.status(200).json(invoice);
//   } catch (error) {
//     console.log("error", "error in cancel subscription", error);
//     next(error);
//   }
// };

export default {
  createSubscription,
  updateSubscription,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
};
