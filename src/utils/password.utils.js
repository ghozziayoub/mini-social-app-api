const bcrypt = require("bcryptjs");
/**
 * Hashes a plaintext password using bcryptjs.
 *
 * @param {string} password - The plaintext password to hash.
 *
 * @returns {Promise<string>} A Promise that resolves to the hashed password.
 */
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);

  return await bcrypt.hash(password, salt);
}

/**
 * Compares a hashed password with a plaintext input password using bcryptjs.
 *
 * @param {string} hashedPassword - The hashed password to compare.
 * @param {string} inputPassword - The plaintext input password to compare.
 *
 * @returns {Promise<boolean>} A Promise that resolves to a boolean indicating whether the passwords match.
 */
async function comparePasswords(inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

module.exports = {
  hashPassword,
  comparePasswords,
};
