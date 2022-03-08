/**
 * Authentication Middleware
 */

const debug = require("debug")("books:auth");
const jwt = require("jsonwebtoken");

/**
 * Validate JWT token requests, used after login to verify
 */
const validateJwtToken = (req, res, next) => {
	// Check that the authroization headers actually exist, if not, return with error
	if (!req.headers.authorization) {
		debug("Authorization header missing");

		return res.status(401).send({
			status: "fail",
			data: "Authorization failed",
		});
	}

	// Example of Authorization: "Bearer eaJksXVCJ9.eyJV9.xndmU"
	// split the authorization header into "authSchema <token>"
	const [authSchema, token] = req.headers.authorization.split(" ");
	if (authSchema.toLowerCase() !== "bearer") {
		//It's not a bearer, return with error
		return res.status(401).send({
			status: "fail",
			data: "Authorization failed; not bearer",
		});
	}

	// Verify that the token is real, set req.user with the returned statement if it's true
	try {
		req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		debug(req.user);
	} catch (error) {
		debug(error);
		return res.status(401).send({
			status: "fail",
			data: "Authorization failed; internal error",
		});
	}

	// Auth passed! Verification complete
	debug("verification complete");
	next();
};

module.exports = {
	validateJwtToken,
};
