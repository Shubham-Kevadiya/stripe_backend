import { PurchaseModel } from "../model/purchase.model.js";

const savePurchase = async (purchaseData) => {
  const purchase = await new PurchaseModel(purchaseData).save();
  return purchase;
};

const getAllPurchase = async (page, limit) => {
  const purchases = await PurchaseModel.find()
    .skip(page ? page - 1 : 1 * limit ? limit : 10)
    .limit(limit ? limit : 10);
  return purchases;
};

const getPurchaseById = async (purchaseId) => {
  const purchase = await PurchaseModel.findById(purchaseId).lean();
  return purchase;
};

const getFilteredPurchaseOfUser = async (query) => {
  const purchase = await PurchaseModel.find(query).lean();
  return purchase;
};

const updatePurchaseById = async (purchaseData) => {
  const purchase = await getPurchaseById(purchaseData.purchaseId);
  if (!purchase) {
    console.log("purchase not found in update purchase");
    throw new Error("NOT_FOUND");
  }
  const updatedPurchase = await PurchaseModel.findByIdAndUpdate(
    purchaseData.purchaseId,
    purchaseData,
    { new: true }
  );
  return updatedPurchase;
};

const deletePurchaseById = async (purchaseId) => {
  const purchase = await getPurchaseById(purchaseId);
  if (!purchase) {
    console.log("purchase not found in delete purchase");
    throw new Error("NOT_FOUND");
  }
  await PurchaseModel.findByIdAndDelete(purchaseId);
  return "purchase deleted successsfully !";
};

export default {
  savePurchase,
  getAllPurchase,
  getPurchaseById,
  getFilteredPurchaseOfUser,
  updatePurchaseById,
  deletePurchaseById,
};
