import { UserModel } from "../model/user.model.js";

const saveUser = async (userData) => {
  const user = await new UserModel(userData).save();
  return user;
};

const getAllUser = async () => {
  const users = await UserModel.find();
  return users;
};

const getUserById = async (userId) => {
  const user = await UserModel.findById(userId).lean();
  return user;
};

const getUserByEmail = async (email) => {
  const user = await UserModel.findOne({ email });
  return user;
};

const updateUserById = async (userData) => {
  const user = await UserModel.findByIdAndUpdate(userData.userId, userData);
  return user;
};

const deleteUserById = async (userId) => {
  await UserModel.findByIdAndDelete(userId);
  return "user deleted successsfully !";
};

export default {
  saveUser,
  getAllUser,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
