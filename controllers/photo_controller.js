/**
 * photo Controller
 */

const debug = require("debug")("photos:photo_controller");
const { matchedData, validationResult } = require("express-validator");
const models = require("../models");

/**
 * NOTE: Only intended for testing
 * Get all resources
 *
 * GET /
 */
const index = async (req, res) => {
	debug(req.user.user_id);
	try {
		const photos = await models.Photo.query({
			where: {
				user_id: req.user.user_id,
			},
		}).fetchAll([(require = false)]);

		console.log(photos);
		res.send({
			status: "success",
			data: photos,
		});
	} catch (error) {
		debug(error);
		res.status(500).send({
			status: "error",
			message: "The user likely does not have any photos yet",
		});
	}
};

/**
 * NOTE: Only intended for testing
 * Get a specific resource
 *
 * GET /:photoId
 */
const show = async (req, res) => {
	try {
		const photo = await new models.Photo({
			id: req.params.photoId,
			user_id: req.user.user_id,
		}).fetch();
		res.send({
			status: "success",
			data: photo,
		});
	} catch (error) {
		debug(error);
		res.status(500).send({
			status: "error",
			message:
				"The photo with that id could not be found, or the user does not have permission to view it",
		});
	}
};

/**
 * Store a new resource
{
  "title": "Confetti Photo #1",
  "url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
  "comment": "Confetti"
}
 *
 * POST /
 */
const store = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: "fail", data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	//add the user id, so that database knows only this user has access to the photo
	validData.user_id = req.user.user_id;

	try {
		const result = await new models.Photo(validData).save();
		debug("Added photo to user successfully: %O", result);

		res.send({
			status: "success",
			data: result,
		});
	} catch (error) {
		res.status(500).send({
			status: "error",
			message:
				"Exception thrown in database when adding a photo to a user.",
		});
		throw error;
	}
};

/**
 * Update a specific resource
 * UPDATE photo password etc
 *
 * PUT /:photoId
 */
const update = async (req, res) => {
	const photoId = req.params.photoId;
	debug("above db req");
	// make sure photo exists
	const photo = await new models.Photo({
		id: photoId,
		user_id: req.user.user_id,
	}).fetch({
		require: false,
	});
	debug("came to photos");
	if (!photo) {
		debug("photo to update was not found or permissions lacked. %o", {
			id: photoId,
		});
		res.status(404).send({
			status: "fail",
			data: "photo to update was not found or permissions lacked",
		});
		return;
	}

	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: "fail", data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	try {
		const updatedphoto = await photo.save(validData);
		debug("Updated photo successfully: %O", updatedphoto);

		res.send({
			status: "success",
			data: photo,
		});
	} catch (error) {
		res.status(500).send({
			status: "error",
			message: "Exception thrown in database when updating a new photo.",
		});
		throw error;
	}
};

/**
 * Destroy a specific resource
 *
 * DELETE /:photoId
 */
const destroy = async (req, res) => {
	try {
		// const photo = await new models.Photo({
		// 	id: req.params.photoId,
		// 	user_id: req.user.user_id,
		// }).fetch();

		//Get the album and its relation.
		const photo = await models.Photo.fetchAlbums(
			req.user.user_id,
			req.params.photoId,
			{ withRelated: ["albums"] }
		);

		console.log(photo);

		const albums = photo.related("albums");

		// const deleted_photo = await photos.destroy(photos);

		const id_array = albums.map((album, index) => album.id);
		console.log(id_array);

		const deleted_album = await photo.albums().detach(id_array);

		const deleted_photo = await photo.destroy(photo);

		//note: delete relations too!

		res.status(500).send({
			status: "success",
			message: { deleted_photo, deleted_album },
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			status: "error",
			message: "Failed to delete photo!",
		});
	}
};

module.exports = {
	index,
	show,
	store,
	update,
	destroy,
};
