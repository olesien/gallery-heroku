/**
 * Album Validation Rules
 */

const { body } = require("express-validator");

/**
 * Create new album
 *
 * Required:
 * title
 */
const createRules = [body("title").isLength({ min: 4 })];

/**
 * Add new photo-album relation
 *
 * Required:
 * photo_id (Integer or Array of Integers)
 */
const createRelationRules = [
	body("photo_id").isNumeric() ||
		body("photo_id").isArray({ min: 1 }).isNumeric(),
];

/**
 * Update album
 *
 * Required:
 * title
 */
const updateRules = [body("title").isLength({ min: 4 })];

module.exports = {
	createRules,
	createRelationRules,
	updateRules,
};
