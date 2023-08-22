const router = require("express").Router();
const {
	createPostCtrl,
	getAllPostsCtrl,
	getPostByIdCtrl,
	getPostsCountCtrl,
	deletePostCtrl,
	updatePostCtrl,
	updatePostImageCtrl,
	toggleLikeCtrl,
} = require("../controllers/postsController");

const photoUpload = require("../middlewares/uploadPhoto");
const validateObjectId = require("../middlewares/validateObjectId");
const { verifyToken } = require("../middlewares/verifyToken");

//* Create post => /api/posts
router.post("/", verifyToken, photoUpload.single("image"), createPostCtrl); //! Logged in user only

//* Get all posts => /api/posts
router.get("/", getAllPostsCtrl); //* Public

//* Get posts count => /api/posts/count
router.get("/count", getPostsCountCtrl); //* Public

//* Get post by id => /api/posts/:id
router.get("/:id", validateObjectId, getPostByIdCtrl); //* Public

//* Delete post by id => /api/posts/:id
router.delete("/:id", validateObjectId, verifyToken, deletePostCtrl); //! Only admin & account owner can access this route

//* Update post by id => /api/posts/:id
router.put("/:id", validateObjectId, verifyToken, updatePostCtrl); //! Only account owner can access this route

//* Update post image by id => /api/posts/upload-image/:id
router.put(
	"/upload-image/:id",
	validateObjectId,
	verifyToken,
	photoUpload.single("image"),
	updatePostImageCtrl,
); //! Only account owner can access this route

//* Toggle like of post => /api/posts/like/:id
router.put("/like/:id", validateObjectId, verifyToken, toggleLikeCtrl); //! Only logged in user can access this route

module.exports = router;
