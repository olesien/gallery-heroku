/**
 * user Validation Rules
 */

const { body } = require("express-validator");
const models = require("../models");

/**
 * Create user validation rules
 *
 * Required:
 * email
 * password
 * first_name
 * last_name
 */
const registerRules = [
	body("email").exists().isEmail().normalizeEmail(),
	body("password").exists().isLength({ min: 5 }).escape(),
	body("first_name").exists().isLength({ min: 2 }).escape(),
	body("last_name").exists().isLength({ min: 2 }).escape(),
];

/**
 *Refresh request validation rules
 *
 * Required:
 * refresh token
 */
const refreshRules = [body("token").exists().isLength({ min: 10 })];

/**
 * Login user validation rules
 *
 * Required:
 * email
 * password
 */
const loginRules = [
	body("email").exists().isEmail().normalizeEmail(),
	body("password").exists().isLength({ min: 5 }).escape(),
];

/**
 * Update user validation rules
 *
 * Required: -
 * Optional: title
 */
const updateRules = [body("title").optional().isLength({ min: 4 })];

module.exports = {
	registerRules,
	refreshRules,
	loginRules,
	updateRules,
};
