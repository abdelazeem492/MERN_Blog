const router = require("express").Router();
const {
	createCommentCtrl,
	getAllCommentsCtrl,
	deleteCommentCtrl,
	updateCommentCtrl,
} = require("../controllers/commentsController");
const validateObjectId = require("../middlewares/validateObjectId");
const { verifyToken, verifyAdminToken } = require("../middlewares/verifyToken");

//* Create comment => /api/comments
router.post("/", verifyToken, createCommentCtrl); //! Logged in user only

//* Get all comments => /api/comments
router.get("/", verifyAdminToken, getAllCommentsCtrl); //! Admin only

//* Delete comment => /api/comments/:id
router.delete("/:id", validateObjectId, verifyToken, deleteCommentCtrl); //! Admin & comment owner only

//* Update comment => /api/comments/:id
router.put("/:id", validateObjectId, verifyToken, updateCommentCtrl); //! Comment owner only

module.exports = router;
