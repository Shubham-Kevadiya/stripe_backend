import { PromocodeModel } from "../model/promocode.model.js";

const savePromocode = async (promocodeData) => {
  const promocode = await new PromocodeModel(promocodeData).save();
  return promocode;
};

const getAllPromocode = async (page, limit) => {
  const promocodes = await PromocodeModel.find()
    .skip((page - 1) * limit)
    .limit(limit);
  return promocodes;
};

const getActivePromocodeAccordingToPlan = async (type, data, page, limit) => {
  console.log(type, data, page, limit);
  const promocodes = await PromocodeModel.find({
    promocodeFor: type,
    isActive: true,
    isDeleted: false,
    currency: data.currency,
    minAmount: { $lte: data.amount },
  })
    .skip((page - 1) * limit)
    .limit(limit);
  return promocodes;
};

const getPromocodeById = async (promocodeId) => {
  const promocode = await PromocodeModel.findById(promocodeId).lean();
  return promocode;
};

const getPromocodeByName = async (name) => {
  const promocode = await PromocodeModel.findOne({
    promocode: name,
  }).lean();
  return promocode;
};

const updatePromocodeById = async (promocodeId, promocodeData) => {
  const promocode = await PromocodeModel.findByIdAndUpdate(
    promocodeId,
    {
      ...promocodeData,
    },
    { new: true }
  );
  return promocode;
};

const deletePromocodeById = async (promocodeId) => {
  await PromocodeModel.findByIdAndDelete(promocodeId);
  return "promocode deleted successsfully !";
};

export default {
  savePromocode,
  getAllPromocode,
  getActivePromocodeAccordingToPlan,
  getPromocodeById,
  getPromocodeByName,
  updatePromocodeById,
  deletePromocodeById,
};
