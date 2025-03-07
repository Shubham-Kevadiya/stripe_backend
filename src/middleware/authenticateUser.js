import userUtils from "../utils/user.utils.js";
import purchaseUtils from "../utils/purchase.utils.js";

const validateAuthIdToken = async (req, res, next) => {
  let userId;
  if (!req.session) {
    return next(new Error("FORBIDDEN"));
  }
  userId = req.session.userId;

  const user = await userUtils.getUserById(userId);
  if (!user) {
    return next(new Error("UNAUTHORIZE"));
  }
  delete user.password;
  delete user.authSecret;
  req.authUser = user;
  next();
  return;
};

const validateIsAdmin = async (req, res, next) => {
  const user = req.authUser;
  if (!user) {
    throw new Error("UNAUTHORIZE");
  }
  if (user.userType != "ADMIN") {
    console.log("Someone tries to access admin apis", {
      name: user.name,
      email: user.email,
    });
    throw new Error("UNAUTHORIZE");
  }
  next();
  return;
};

const checkUserHasActivePlan = async (req, res, next) => {
  const activePlan = await purchaseUtils.getFilteredPurchaseOfUser({
    isCanceled: false,
    isFinished: false,
    paymentConfirmed: true,
    userId: req.auth._id,
  });
  if (!activePlan || activePlan.length == 0) {
    console.log("user does not have active plan", { userId: req.authUser._id });
    throw new Error("UNAUTHORIZE");
  }
  const user = req.authUser;
  if (!user) {
    throw new Error("UNAUTHORIZE");
  }
  if (user.userType != "ADMIN") {
    console.log("Someone tries to access admin apis", {
      name: user.name,
      email: user.email,
    });
    throw new Error("UNAUTHORIZE");
  }
  next();
  return;
};

export default {
  validateAuthIdToken,
  validateIsAdmin,
  checkUserHasActivePlan,
};
