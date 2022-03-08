/**
 * user Controller
 */

const bcrypt = require("bcrypt");
const debug = require("debug")("books:auth_controller");
const jwt = require("jsonwebtoken");
const { matchedData, validationResult } = require("express-validator");
const models = require("../models");

// POST to /register
//  Expected:
//  {
//     "email": "jn@badcameraphotography.com",
//     "password": "omg-smile",
//     "first_name": "Johan",
//     "last_name": "Nordström"
//   }

const register = async (req, res) => {
	//handle possible errors tied to the body data
	const errors = validationResult(req);
	//check if there are errors, if not, go next to controller
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: "fail", data: errors.array() });
	}

	// This data should be valid, contains what is written above
	const validData = matchedData(req);

	debug("The validated data:", validData);

	try {
		//change the password to be hashed
		validData.password = await bcrypt.hash(
			validData.password,
			models.User.hashSaltRounds
		);
	} catch (error) {
		debug(error);
		res.status(500).send({
			status: "error",
			message: "Exception thrown when hashing the password.",
		});
		throw error;
	}

	try {
		const user = await new models.User(validData).save();
		debug("Created new user successfully: %O", user);

		res.send({
			status: "success",
			data: {
				user,
			},
		});
	} catch (error) {
		debug(error);
		res.status(500).send({
			status: "error",
			message: "Failed to create new user; internal error",
		});
		throw error;
	}
};

const refresh = async (req, res) => {
	//handle possible errors tied to the body data
	const errors = validationResult(req);
	//check if there are errors, if not, go next to controller
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: "fail", data: errors.array() });
	}

	// grab token from validated data, check signature and expiry date
	const { token } = matchedData(req);

	try {
		//verify token using refresh token secret
		const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

		//remove expiry if they exist

		delete payload?.iat;
		delete payload?.exp;

		// sign payload and get access-token
		const access_token = jwt.sign(
			payload,
			process.env.ACCESS_TOKEN_SECRET,
			{
				expiresIn: process.env.ACCESS_TOKEN_LIFETIME || "1h",
			}
		);

		// respond with the access-token
		return res.send({
			status: "success",
			data: {
				access_token,
			},
		});
	} catch (error) {
		debug(error);
		return res.status(401).send({
			status: "fail",
			data: "Invalid token",
		});
	}
};

const login = async (req, res) => {
	//handle possible errors tied to the body data
	const errors = validationResult(req);
	//check if there are errors, if not, go next to controller
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: "fail", data: errors.array() });
	}

	// take email and password from the body that should now be verified.
	const { email, password } = matchedData(req);

	// login the user
	const user = await models.User.login(email, password);
	if (!user) {
		return res.status(401).send({
			status: "fail",
			data: "Authentication failed.",
		});
	}

	// construct jwt payload
	const payload = {
		sub: user.get("email"),
		user_id: user.get("id"),
		name: user.get("first_name") + " " + user.get("last_name"),
	};

	// sign payload and get access-token
	const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: process.env.ACCESS_TOKEN_LIFETIME || "1h",
	});

	//sign payload and refresh token
	const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: process.env.REFRESH_TOKEN_LIFETIME || "10h",
	});

	// respond with the access-token
	return res.send({
		status: "success",
		data: {
			access_token,
			refresh_token,
			//			access_token: access_token,
		},
	});
};

module.exports = {
	register,
	refresh,
	login,
};
