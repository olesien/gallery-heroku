/**
 * album Controller
 */

const debug = require("debug")("gallery:album_controller");
const { matchedData, validationResult } = require("express-validator");
const models = require("../models");

/**
 * Get all resources
 *
 * GET /
 */
const index = async (req, res) => {
	debug(req.user.user_id);
	try {
		const albums = await models.Album.query({
			where: {
				user_id: req.user.user_id,
			},
		}).fetchAll([(require = false)]);

		debug(albums);
		res.send({
			status: "success",
			data: albums,
		});
	} catch (error) {
		debug(error);
		res.status(500).send({
			status: "error",
			message: "The user likely does not have any albums yet",
		});
	}
};

/**
 * NOTE: Only intended for testing
 * Get a specific resource
 *
 * GET /:albumId
 */
const show = async (req, res) => {
	try {
		// const album = await new models.Album({
		// 	id: req.params.albumId,
		// 	user_id: req.user.user_id,
		// }).fetch();
		const album = await models.Album.fetchPhotos(
			req.user.user_id,
			req.params.albumId,
			{
				withRelated: ["photos"],
			}
		);
		res.send({
			status: "success",
			data: album,
		});
	} catch (error) {
		debug(error);
		debug(error);
		res.status(500).send({
			status: "error",
			message:
				"The album with that id could not be found, or the user does not have permission to view it",
		});
	}
};

/**
 * Store a new resource
{
  "title": "Confetti album #1",
  "url": "https://images.unsplash.com/album-1492684223066-81342ee5ff30",
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

	//add the user id, so that database knows only this user has access to the album
	validData.user_id = req.user.user_id;

	try {
		const result = await new models.Album(validData).save();
		debug("Added album to user successfully: %O", result);

		res.send({
			status: "success",
			data: result,
		});
	} catch (error) {
		res.status(500).send({
			status: "error",
			message:
				"Exception thrown in database when adding a album to a user.",
		});
	}
};

// POST album photo relation
//18:53:26	insert into `albums_photos` (`album_id`, `photo_id`) values (3, 7)	Error Code: 1452. Cannot add or update a child row: a foreign key constraint fails (`gallery`.`albums_photos`, CONSTRAINT `albums_photos_ibfk_2` FOREIGN KEY (`photo_id`) REFERENCES `photos` (`id`))	0.000 sec

const storeRelation = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: "fail", data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	//add the user id, so that database knows only this user has access to the photo
	validData.user_id = req.user.user_id;

	// Get the album & photo relation to that album

	const album = await models.Album.fetchPhotos(
		req.user.user_id,
		req.params.albumId,
		{ withRelated: ["photos"], require: false }
	);

	debug(album);
	//If not defined, album does not exist or auth is lacked
	if (!album) {
		return res.send({
			status: "fail",
			data: "Album does not exist or you do not have permission to view it!",
		});
	}

	//get the photos relation from above album
	const photos = album.related("photos");
	//Check if this exact relation already exists, will be falsy or truthy

	//start of for array IF photo_id is an array <- add this to valdiation/album too (allow arrays)
	let photoArrayIds = [];
	if (Array.isArray(validData.photo_id)) {
		photoArrayIds = validData.photo_id;
	} else {
		photoArrayIds.push(validData.photo_id);
	}
	let cancelId = false;

	//Check if one of the photos is already added
	photoArrayIds.forEach((photo_id, index) => {
		const existing_photo = photos.find((photo) => photo.id == photo_id);

		//if it does not, aka is falsy, throw err
		if (existing_photo) {
			cancelId = photo_id;
		}
	});

	if (cancelId) {
		return res.send({
			status: "fail",
			data: "Photo already exists in this album: " + cancelId,
		});
	}

	//check through all photos to see who is owner
	try {
		//Get list of all photos from id array
		const photoArray = await models.Photo.where(
			"id",
			"IN",
			photoArrayIds
		).fetchAll({ required: false });

		//Go through above array, and match user ids to see who is owner & of posting user has perms
		photoArray.forEach((photo) => {
			const photo_user_id = photo.get("user_id");
			if (req.user.user_id != photo_user_id) {
				cancelId = photo.get("id");
			}
			debug(photo.user_id, photo_user_id);
		});
	} catch (error) {
		debug(error);
		res.status(500).send({
			status: "error",
			message:
				"Exception thrown in database when adding a photo to an album. One photo might not exist!",
		});
	}

	//Can't do return res in for each arrays, so doing it here
	if (cancelId) {
		return res.send({
			status: "fail",
			data: "Photo is not owned by user: " + cancelId,
		});
	}

	//Try and add the photo. If this fails it is probably due to the possible situation where that photo Id does not actually exist
	try {
		const result = await album.photos().attach(photoArrayIds);
		debug("Added photo(s) to album successfully: %O", result);

		res.send({
			status: "success",
			data: null,
		});
	} catch (error) {
		res.status(500).send({
			status: "error",
			message:
				"Exception thrown in database when adding a photo to an album. One of the input photo IDs likely don't exist!",
		});
	}
};

/**
 * Update a specific resource
 * UPDATE album
 *
 * PUT /:albumId
 */
const update = async (req, res) => {
	const albumId = req.params.albumId;
	debug("above db req");
	// make sure album exists
	const album = await new models.Album({
		id: albumId,
		user_id: req.user.user_id,
	}).fetch({
		require: false,
	});
	debug("came to albums");
	if (!album) {
		debug("album to update was not found or permissions lacked. %o", {
			id: albumId,
		});
		res.status(404).send({
			status: "fail",
			data: "album to update was not found or permissions lacked",
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
		const updatedalbum = await album.save(validData);
		debug("Updated album successfully: %O", updatedalbum);

		res.send({
			status: "success",
			data: album,
		});
	} catch (error) {
		res.status(500).send({
			status: "error",
			message: "Exception thrown in database when updating a new album.",
		});
	}
};

/**
 * Destroy a specific resource
 *
 * DELETE /:albumId
 */
const destroy = async (req, res) => {
	try {
		const album = await models.Album.fetchPhotos(
			req.user.user_id,
			req.params.albumId,
			{ withRelated: ["photos"] }
		);

		const photos = album.related("photos");

		// const deleted_photo = await photos.destroy(photos);

		const id_array = photos.map((photo, index) => photo.id);
		const deleted_photo = await album.photos().detach(id_array);

		//Here I want to detect all photo album relations, and destroy them!
		const deleted_album = await album.destroy(album);

		//note: delete relations too!

		res.status(500).send({
			status: "success",
			data: { deleted_album, deleted_photo },
		});
	} catch (error) {
		debug(error);
		res.status(500).send({
			status: "error",
			message: "Failed to delete album!",
		});
	}
};

//req.params.albumId, req.params.photoId
const destroyRelation = async (req, res) => {
	// check for any validation errors
	const photo_id = req.params.photoId;
	// Get the album & photo relation to that album

	const album = await models.Album.fetchPhotos(
		req.user.user_id,
		req.params.albumId,
		{ withRelated: ["photos"], require: false }
	);
	//Check if album is not defined, meaning wrong album id
	if (!album) {
		return res.send({
			status: "fail",
			data: "Album does not exist or you do not own it!",
		});
	}

	//get the photos relation from above album
	const photos = album.related("photos");

	const existing_photo = photos.find((photo) => photo.id == photo_id);

	//if it does not, aka is falsy, throw err
	if (!existing_photo) {
		return res.send({
			status: "fail",
			data: "Photo does not exist in this album: " + photo_id,
		});
	}
	debug(photo_id);
	debug(photos);

	//Try and add the photo. If this fails it is probably due to the possible situation where that photo Id does not actually exist
	try {
		const result = await album.photos().detach(photo_id);
		debug("Removed phtoo from album: %O", result);

		res.send({
			status: "success",
			data: null,
		});
	} catch (error) {
		debug(error);
		res.status(500).send({
			status: "error",
			message:
				"Exception thrown in database when adding a photo to an album. There is likely no photo with this ID!",
		});
	}
};

module.exports = {
	index,
	show,
	store,
	storeRelation,
	update,
	destroy,
	destroyRelation,
};
