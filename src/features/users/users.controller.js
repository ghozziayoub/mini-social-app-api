const usersService = require("./users.service");
const { AppError } = require("../../middleware/errorHandler");

const signup = async (req, res, next) => {
  try {
    await usersService.signup(req.body);
    res.status(201).json({ message: "User signed up successfully." });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

const login = async (req, res, next) => {
  try {
    const token = await usersService.login(req.body);
    
    res.setHeader("Access-Control-Expose-Headers", "X-Token");
    res.setHeader("X-Token", token);
    res.json({ message: "User logged in successfully." });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

module.exports = { signup, login };
