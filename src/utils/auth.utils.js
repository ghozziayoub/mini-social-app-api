const jwt = require("jsonwebtoken");
const env = require("../config/env");

/**
 * Creates a token using JWT (JSON Web Token).
 *
 * @param {Object} payload - The payload to be included in the token.
 *
 * @returns {string} The generated token.
 */
const createJWTToken = (payload) => {
  return jwt.sign(payload, env.TOKEN_SECRET, {
    expiresIn: env.TOKEN_EXPIRES_IN,
  });
};

/**
 * Verify token
 * @param {string} token - The object to filter.
 */
async function verifyJWTToken(token) {
  try {
    const payload = jwt.verify(token, env.TOKEN_SECRET);
    return { payload, error: null };
  } catch (error) {
    return { payload: null, error: error.message };
  }
}

module.exports = {
  createJWTToken,
  verifyJWTToken,
};
