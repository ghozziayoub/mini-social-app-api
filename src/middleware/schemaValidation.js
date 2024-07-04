const { AppError } = require("./errorHandler");
const zod = require("zod");
const express = require("express");

/**
 * Express middleware for validating request data against a specified schema.
 *
 * @param {zod.ZodObject<any, any, any>} schema - The Zod schema to validate against.
 * @returns {express.RequestHandler} Express middleware function.
 */
const validate = (schema) => (req, _res, next) => {
  try {
    const data = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    req.body = data.body;
    req.query = data.query;
    req.params = data.params;

    next();
  } catch (err) {
    if (err instanceof zod.z.ZodError) {
      const fieldErrors = err.errors.map((error) => ({
        field: error.path.join("."),
        message: error.message,
      }));
      next(new AppError("Validation Error", 400, fieldErrors));
    } else {
      next(new AppError("Invalid data", 400));
    }
  }
};

module.exports = { validate };
