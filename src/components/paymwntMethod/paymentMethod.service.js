// import CryptoJS from "crypto-js";
// import Stripe from "stripe";
// import {
//   getUserByEmail,
//   saveUser,
//   updateUserById,
// } from "../../utils/user.utils.js";
// import config from "../../config/config.js";
// import { UserModel } from "../../model/user.model.js";

// export const registerUser = async (userData) => {
//   try {
//     let user;
//     user = await getUserByEmail(userData.email);
//     if (user) {
//       console.log("User already exist with same email");
//       throw new Error("USER_ALREADY_EXIST");
//     }
//     user = await saveUser(
//       new UserModel({
//         ...userData,
//         password: CryptoJS.AES.encrypt(
//           userData.password,
//           config.crypto.aes_key
//         ).toString(),
//       })
//     );
//     const stripe = Stripe(config.stipe.secret_key);
//     const customer = await stripe.customers.create({
//       name: user.name,
//       email: user.email,
//     });
//     user.customerId = customer.id;
//     await updateUserById(user);
//     return user;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// export const userLogin = async (loginData) => {
//   try {
//     const user = await getUserByEmail(loginData.email);
//     if (!user) {
//       console.log("User not exist with this email");
//       throw new Error("USER_NOT_FOUND");
//     }

//     const password = CryptoJS.AES.decrypt(
//       user.password,
//       config.crypto.aes_key
//     ).toString(CryptoJS.enc.Utf8);
//     if (password != loginData.password) {
//       console.log("invalid password");
//       throw new Error("INVALID_PASSWORD");
//     }

//     delete user.password;

//     return user;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };
