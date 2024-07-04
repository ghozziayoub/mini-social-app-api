const { AppError } = require("./errorHandler");
const User = require("../features/users/users.model");
const authUtils = require("../utils/auth.utils");

const authenticateUser = async (req, _res, next) => {
  // Check for authorization header with JWT token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized. Missing or invalid token.", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const { payload: decoded } = await authUtils.verifyJWTToken(token);

    if (!decoded) {
      return next(AppError("Unauthorized. Invalid token", 401));
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError("User not found.", 404));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError("Unauthorized. Invalid token.", 401));
  }
};

module.exports = {
  authenticateUser,
};
