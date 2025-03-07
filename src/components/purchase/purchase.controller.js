import purchaseService from "./purchase.service.js";

const getAllFilteredPurchaseOfUser = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const payload = req.body;
    const purchase = await purchaseService.getAllFilteredPurchaseOfUser({
      ...payload,
      userId: userId,
    });
    return res.status(200).json({ purchase });
  } catch (error) {
    console.log("error", "error in get all filtered purchase", error);
    next(error);
  }
};

export default { getAllFilteredPurchaseOfUser };
