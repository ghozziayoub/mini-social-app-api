const { z } = require("zod");
require("dotenv").config();

const envSchema = z.object({
  MONGO_URL: z.string().trim().min(1),
  TOKEN_SECRET: z.string().trim().min(1),
  TOKEN_EXPIRES_IN: z.string().min(2),
  PORT: z.preprocess(Number, z.number()).default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const envServer = envSchema.safeParse(process.env);

if (!envServer.success) {
  console.error("There is an error with the server environment variables");
  console.error(envServer.error.issues);
  process.exit(1);
}

module.exports = envServer.data;
