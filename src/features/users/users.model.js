const mongoose = require("mongoose");
const passwordUtils = require("../../utils/password.utils");

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

UserSchema.pre("save", { document: true, query: false }, async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const hashedPassword = await passwordUtils.hashPassword(this.password);

    this.password = hashedPassword;

    next();
  } catch (error) {
    return next(error);
  }
  next();
});

module.exports = mongoose.model("user", UserSchema);
