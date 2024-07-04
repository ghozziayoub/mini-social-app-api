const express = require("express");
const usersController = require("./users.controller");
const { validate } = require("../../middleware/schemaValidation");
const { userSignupSchema, userLoginSchema } = require("./users.schemas");

const router = express.Router();

router.post("/signup", validate(userSignupSchema), usersController.signup);
router.post("/login", validate(userLoginSchema), usersController.login);

module.exports = router;
