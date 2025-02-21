import { getUserById } from "../service/user.service.js";

export const validateAuthIdToken = async (req, res, next) => {
  let userId;
  if (!req.session) {
    throw new Error("FORBIDDEN");
  }
  userId = req.session.userId;

  const user = await getUserById(userId);
  if (!user) {
    throw new Error("UNAUTHORIZE");
  }
  delete user.password;
  delete user.authSecret;
  req.authUser = user;
  next();
  return;
};

export const validateIsAdmin = async (req, res, next) => {
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
