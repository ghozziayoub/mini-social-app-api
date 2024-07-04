const User = require("./users.model");
const { AppError } = require("../../middleware/errorHandler");
const passwordUtils = require("../../utils/password.utils");
const authUtils = require("../../utils/auth.utils");

const signup = async (userData) => {
  const { fullName, email, password } = userData;
  let user = await User.findOne({ email });
  if (user) throw new AppError("User already exists.", 400);

  user = new User({ fullName, email, password });
  await user.save();

  return user;
};

const login = async (userData) => {
  const { email, password } = userData;
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new AppError("Invalid credentials.", 401);

  const isMatch = await passwordUtils.comparePasswords(password, user.password);
  if (!isMatch) throw new AppError("Invalid credentials.", 401);

  const token = authUtils.createJWTToken({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
  });
  return token;
};

module.exports = { login, signup };
