/**
 * Photo Validation Rules
 */

const { body } = require("express-validator");
const models = require("../models");

/**
 * Create new photo
 *
 * Required:
 * title
 * url
 *
 * Optional:
 * comment
 */
const createRules = [
	body("title").isLength({ min: 4 }),
	body("url").isURL(),
	body("comment").optional().isLength({ min: 4 }),
];

/**
 * Update photo
 *
 * Optional:
 * title
 * url
 * comment
 */

const updateRules = [
	body("title").optional().isLength({ min: 4 }),
	body("url").optional().isURL(),
	body("comment").optional().isLength({ min: 4 }),
];

module.exports = {
	createRules,
	updateRules,
};
