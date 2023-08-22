const asyncHandler = require("express-async-handler");
const { User } = require("../models/User");
const {
	Comment,
	createCommentValidation,
	updateCommentValidation,
} = require("../models/Comment");

/**_____________________________________________
 * @desc    Create new comment 
 * @route   /api/comments
 * @method  POST
 * @access  private //! Only logged in user can access this route
________________________________________________*/
module.exports.createCommentCtrl = asyncHandler(async (req, res) => {
	//* Validate Request
	const { error } = createCommentValidation(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });

	const profile = await User.findById(req.user.id);

	//* Create new comment
	const comment = await Comment.create({
		postId: req.body.postId,
		text: req.body.text,
		user: req.user.id,
		userInfo: {
			firstName: profile.firstName,
			lastName: profile.lastName,
			profilePic: profile.profilePic,
		},
	});

	//* Send a response to the client
	res.status(201).json(comment);
});

/**_____________________________________________
 * @desc    Get all comments
 * @route   /api/comments
 * @method  GET
 * @access  private //! Only admin can access this route
________________________________________________*/
module.exports.getAllCommentsCtrl = asyncHandler(async (req, res) => {
	const comments = await Comment.find().populate("user", [
		"firstName",
		"lastName",
		"profilePic",
	]);

	//* Send a response to the client
	res.status(200).json(comments);
});

/**_____________________________________________
 * @desc    Delete comment
 * @route   /api/comments/:id
 * @method  DELETE
 * @access  private //! Only admin & comment owner can access this route
________________________________________________*/
module.exports.deleteCommentCtrl = asyncHandler(async (req, res) => {
	const comment = await Comment.findById(req.params.id);
	if (!comment) return res.status(404).json({ message: "Comment not found" });
	if (req.user.isAdmin || req.user.id === comment.user.toString())
		await Comment.findByIdAndDelete(req.params.id);
	else
		res
			.status(403)
			.json({ message: "Only admin & comment owner can access this route" });

	//* Send a response to the client
	res.status(200).json({ message: "Comment deleted successfully" });
});

/**_____________________________________________
 * @desc    Update comment
 * @route   /api/comments/:id
 * @method  PUT
 * @access  private //! Only comment owner can access this route
________________________________________________*/
module.exports.updateCommentCtrl = asyncHandler(async (req, res) => {
	//* Validate Request
	const { error } = updateCommentValidation(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });

	//? Check if comment exists
	const comment = await Comment.findById(req.params.id);
	if (!comment) return res.status(404).json({ message: "Comment not found" });

	//? Check if comment belongs to the logged in user
	if (comment.user.toString() !== req.user.id)
		return res
			.status(403)
			.json({ message: "Only comment owner can access this route" });

	//* Update comment
	const updatedComment = await Comment.findByIdAndUpdate(
		req.params.id,
		{
			$set: {
				text: req.body.text,
			},
		},
		{ new: true },
	).populate("user", ["firstName", "lastName", "profilePic"]);

	//* Send a response to the client
	res.status(200).json(updatedComment);
});
