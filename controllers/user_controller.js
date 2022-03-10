/**
 * user Controller
 */

const debug = require("debug")("gallery:user_controller");
const { matchedData, validationResult } = require("express-validator");
const models = require("../models");

/**
 * NOTE: Only intended for testing
 * Get all resources
 *
 * GET /
 */
const index = async (req, res) => {
	const users = await models.User.fetchAll();
	debug(users);
	res.send({
		status: "success",
		data: users,
	});
};

/**
 * NOTE: Only intended for testing
 * Get a specific resource
 *
 * GET /:userId
 */
const show = async (req, res) => {
	const user = await new models.User({ id: req.params.userId }).fetch();
	debug(user);
	res.send({
		status: "success",
		data: user,
	});
};

module.exports = {
	index,
	show,
};
