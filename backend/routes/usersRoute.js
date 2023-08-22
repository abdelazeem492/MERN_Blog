const router = require("express").Router();
const photoUpload = require("../middlewares/uploadPhoto");
const validateObjectId = require("../middlewares/validateObjectId");

const {
	getAllUsersCtrl,
	getUserCtrl,
	updateUserCtrl,
	uploadProfilePictureCtrl,
	deleteUserCtrl,
	getUsersCountCtrl,
} = require("../controllers/userController");

const {
	verifyAdminToken,
	verifyAccountOwnerToken,
	verifyToken,
	verifyAdminAndOwnerToken,
} = require("../middlewares/verifyToken");

//* Get all users => /api/users
router.get("/", verifyAdminToken, getAllUsersCtrl); //! Admin only

//* Get users count => /api/users/count
router.get("/count", verifyAdminToken, getUsersCountCtrl); //! Admin only

//* Get user by id => /api/users/:id
router.get("/:id", validateObjectId, getUserCtrl); //* Public

//* Update user => /api/users/:id
router.put("/:id", validateObjectId, verifyAccountOwnerToken, updateUserCtrl); //! Account owner only

//* Delete user => /api/users/:id
router.delete(
	"/:id",
	validateObjectId,
	verifyAdminAndOwnerToken,
	deleteUserCtrl,
); //! Admin & Account owner only

//* Upload profile picture => /api/users/upload-profile-picture
router.post(
	"/upload-profile-picture",
	verifyToken,
	photoUpload.single("profilePic"),
	uploadProfilePictureCtrl,
); //! Account owner only

module.exports = router;
