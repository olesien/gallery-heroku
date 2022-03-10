const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_controller");
const { matchedData, validationResult } = require("express-validator");
const userValidationRules = require("../validation/user");
const auth = require("../middlewares/auth");

/* GET / */
router.get("/", (req, res, next) => {
	res.send({ success: true, data: { msg: "oh, hi" } });
});

//intended for testing purposes and reference
router.use("/users", require("./user"));

//photos from the user
router.use("/photos", auth.validateJwtToken, require("./photo"));

//albums from the user
router.use("/albums", auth.validateJwtToken, require("./album"));

// register a new user
router.post("/register", [
	userValidationRules.registerRules,
	authController.register,
]);

// login user to receive a JWT secret token / refresh token
router.post("/login", [userValidationRules.loginRules, authController.login]);

//Get new secret token with refresh token
router.post("/refresh", [
	userValidationRules.refreshRules,
	authController.refresh,
]);

module.exports = router;
