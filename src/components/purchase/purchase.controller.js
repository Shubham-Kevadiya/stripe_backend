import purchaseService from "./purchase.service.js";

const createPurchase = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const purchaseData = req.body;
    const purchase = await purchaseService.createPurchase({
      userId,
      ...purchaseData,
    });
    return res.status(200).json({ purchase });
  } catch (error) {
    console.log("error", "error in create purchase", error);
    next(error);
  }
};

export default { createPurchase };
