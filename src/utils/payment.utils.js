import { PaymentModel } from "../model/payment.model.js";

const savePayment = async (paymentData) => {
  const payment = await new PaymentModel(paymentData).save();
  return payment;
};

const getAllPayment = async (page, limit) => {
  const payments = await PaymentModel.find()
    .skip(page ? page - 1 : 1 * limit ? limit : 10)
    .limit(limit ? limit : 10);
  return payments;
};

const getAllCistinctPaymentUsingStripePaymentId = async () => {
  const payments = await PaymentModel.distinct("stripePaymentId");
  return payments;
};

const getPaymentById = async (paymentId) => {
  const payment = await PaymentModel.findById(paymentId);
  return payment;
};

const getPaymentusingWebhookData = async (webhookData) => {
  const payment = await PaymentModel.findOne({ ...webhookData }).lean();
  return payment;
};

const updatePaymentById = async (paymentData) => {
  const payment = await getPaymentById(paymentData.paymentId);
  if (!payment) {
    console.log("payment not found in update payment");
    throw new Error("NOT_FOUND");
  }
  const updatedPayment = await PaymentModel.findByIdAndUpdate(
    paymentData.paymentId,
    paymentData,
    // JSON.parse(JSON.stringify(paymentData)),
    { new: true }
  );
  return updatedPayment;
};

const deletePaymentById = async (paymentId) => {
  const payment = await getPaymentById(paymentId);
  if (!payment) {
    console.log("payment not found in delete payment");
    throw new Error("NOT_FOUND");
  }
  await PaymentModel.findByIdAndDelete(paymentId);
  return "payment deleted successsfully !";
};

export default {
  savePayment,
  getAllPayment,
  getAllCistinctPaymentUsingStripePaymentId,
  getPaymentById,
  getPaymentusingWebhookData,
  updatePaymentById,
  deletePaymentById,
};
