const { z } = require("zod");

const userSignupSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});

const userLoginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});

module.exports = {
  userSignupSchema,
  userLoginSchema,
};
