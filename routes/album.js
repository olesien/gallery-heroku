const express = require("express");
const router = express.Router();
const albumController = require("../controllers/album_controller");
const albumValidationRules = require("../validation/album");

/* Get all albums */
router.get("/", albumController.index);

/* Get a specific album and the photos that go with it */
router.get("/:albumId", albumController.show);

/* Add a new album */
router.post("/", albumValidationRules.createRules, albumController.store);
/* Add one or many new photos to album */
router.post(
	"/:albumId/photos",
	albumValidationRules.createRelationRules,
	albumController.storeRelation
);

/* Update album */
router.put(
	"/:albumId",
	albumValidationRules.updateRules,
	albumController.update
);

/* Destroy album & its relations */
router.delete("/:albumId", albumController.destroy);

/* Destroy photo relation */
router.delete("/:albumId/photos/:photoId", albumController.destroyRelation);

module.exports = router;
