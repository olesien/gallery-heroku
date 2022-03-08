/**
 * photo Validation Rules
 */

const { body } = require("express-validator");
const models = require("../models");

const createRules = [body("title").isLength({ min: 4 })];

const createRelationRules = [
	body("photo_id").isNumeric() ||
		body("photo_id").isArray({ min: 1 }).isNumeric(),
];

const updateRules = [body("title").isLength({ min: 4 })];

module.exports = {
	createRules,
	createRelationRules,
	updateRules,
};
