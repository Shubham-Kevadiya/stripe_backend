import promocodeService from "./promocode.service.js";

const createPromocode = async (req, res, next) => {
  try {
    const payloadValue = req.body;
    const promocode = await promocodeService.createPromocode(payloadValue);
    return res.status(200).json(promocode);
  } catch (error) {
    console.log("error", "error in create promocode", error);
    next(error);
  }
};

const getAllPromocode = async (req, res, next) => {
  try {
    const page = req.query.page;
    const limit = req.query.limit;
    const promocode = await promocodeService.getPromocodes(page, limit);
    return res.status(200).json({ promocode });
  } catch (error) {
    console.log("error", "error in get all promocode", error);
    next(error);
  }
};

const getActivePromocodeAccordingToPlan = async (req, res, next) => {
  try {
    const page = req.query.page;
    const limit = req.query.limit;
    const type = req.params.type;
    const promocode = await promocodeService.getActivePromocodeAccordingToPlan(
      type,
      req.body,
      page,
      limit
    );
    return res.status(200).json({ promocode });
  } catch (error) {
    console.log("error", "error in get active promocode", error);
    next(error);
  }
};

const getPromocodeById = async (req, res, next) => {
  try {
    const promocodeId = req.params.promocodeId;
    const promocode = await promocodeService.getPromocodeById(promocodeId);
    return res.status(200).json({ promocode });
  } catch (error) {
    console.log("error", "error in get promocode by id", error);
    next(error);
  }
};

const updatePromocodeById = async (req, res, next) => {
  try {
    const promocodeId = req.params.promocodeId;
    const promocode = await promocodeService.updatePromocode({
      promocodeId,
      ...req.body,
    });
    return res.status(200).json({ promocode });
  } catch (error) {
    console.log("error", "error in update promocode by id", error);
    next(error);
  }
};

const deletePromocodeById = async (req, res, next) => {
  try {
    const promocodeId = req.params.promocodeId;
    await promocodeService.deletePromocode(promocodeId, req.body);
    return res.status(200).json({ msg: "promocode deleted successfully" });
  } catch (error) {
    console.log("error", "error in delete promocode by id", error);
    next(error);
  }
};

export default {
  createPromocode,
  getAllPromocode,
  getActivePromocodeAccordingToPlan,
  getPromocodeById,
  updatePromocodeById,
  deletePromocodeById,
};
