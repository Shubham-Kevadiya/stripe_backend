import authService from './auth.service.js';

const register = async (req, res, next) => {
  try {
    const payloadValue = req.body;
    const user = await authService.registerUser(payloadValue);
    req.session.userId = user._id;
    delete user.password;
    return res.status(200).json(user);
  } catch (error) {
    console.log('error', 'error in register', error);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const payloadValue = req.body;

    const user = await authService.userLogin(payloadValue);

    req.session.userId = user._id;
    // req.session.cookie.maxAge = 60 * 60 * 1000;

    return res.status(200).json(user);
  } catch (error) {
    console.log('error', 'error in login', error);
    next(error);
  }
};

export default {
  register,
  login,
};
