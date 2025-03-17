import CryptoJS from 'crypto-js';
import userUtils from '../../utils/user.utils.js';
import config from '../../config/config.js';
import { UserModel } from '../../model/user.model.js';
import stripeHelper from '../../helper/stripe.helper.js';

const registerUser = async (userData) => {
  try {
    let user;
    user = await userUtils.getUserByEmail(userData.email);
    if (user) {
      console.log('User already exist with same email');
      throw new Error('USER_ALREADY_EXIST');
    }
    // think about this test case :: find customer from stripe using name and email to prevent duplication of user in stripe. what if user delete his account and recreate it.
    user = await userUtils.saveUser(
      new UserModel({
        ...userData,
        password: CryptoJS.AES.encrypt(
          userData.password,
          config.crypto.aes_key
        ).toString(),
      })
    );
    const customer = await stripeHelper.createCustomerInStripe({
      name: user.name,
      email: user.email,
    });
    user.customerId = customer.id;
    await userUtils.updateUserById({ ...user, userId: user._id });
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const userLogin = async (loginData) => {
  try {
    const user = await userUtils.getUserByEmail(loginData.email);
    if (!user) {
      console.log('User not exist with this email');
      throw new Error('USER_NOT_FOUND');
    }

    const password = CryptoJS.AES.decrypt(
      user.password,
      config.crypto.aes_key
    ).toString(CryptoJS.enc.Utf8);
    if (password != loginData.password) {
      console.log('invalid password');
      throw new Error('INVALID_PASSWORD');
    }

    delete user.password;

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
  registerUser,
  userLogin,
};
