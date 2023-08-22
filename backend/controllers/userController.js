const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, updateUserValidation } = require("../models/User");
const path = require("path");
const fs = require("fs");
const {
	cloudinaryUploadImage,
	cloudinaryRemoveImage,
	cloudinaryRemoveMultipleImage,
} = require("../utils/cloudinary");
const { Post } = require("../models/Post");
const { Comment } = require("../models/Comment");

/**_____________________________________________
 * @desc    Get all users 
 * @route   /api/users
 * @method  GET
 * @access  private //! Only admin can access this route
________________________________________________*/
module.exports.getAllUsersCtrl = asyncHandler(async (req, res) => {
	const users = await User.find().select("-password").populate("posts");
	res.status(200).json(users);
});

/**_____________________________________________
 * @desc    Get users count
 * @route   /api/users/count
 * @method  GET
 * @access  private //! Only admin can access this route
________________________________________________*/
module.exports.getUsersCountCtrl = asyncHandler(async (req, res) => {
	const usersCount = await User.count();
	res.status(200).json({ usersCount });
});

/**_____________________________________________
 * @desc    Get user by id 
 * @route   /api/users/:id
 * @method  GET
 * @access  public
________________________________________________*/
module.exports.getUserCtrl = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id)
		.select("-password")
		.populate("posts");
	if (!user) return res.status(404).json({ message: "User not found" });
	res.status(200).json(user);
});

/**_____________________________________________
 * @desc    Update user
 * @route   /api/users/:id
 * @method  PUT
 * @access  private //! Only account owner can access this route
________________________________________________*/
module.exports.updateUserCtrl = asyncHandler(async (req, res) => {
	//* Validate Request
	const { error } = updateUserValidation(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });

	//* Hashing the password
	if (req.body.password) {
		const salt = await bcrypt.genSalt(10);
		req.body.password = await bcrypt.hash(req.body.password, salt);
	}

	//* Updating the user
	const updatedUser = await User.findByIdAndUpdate(
		req.params.id,
		{
			$set: {
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				password: req.body.password,
				bio: req.body.bio,
			},
		},
		{ new: true },
	)
		.select("-password")
		.populate("posts");

	//* Sending a response to the client
	res.status(200).json(updatedUser);
});

/**_____________________________________________
 * @desc    Upload profile picture
 * @route   /api/users/upload-profile-picture
 * @method  POST
 * @access  private //! Only account owner can access this route
________________________________________________*/
module.exports.uploadProfilePictureCtrl = asyncHandler(async (req, res) => {
	//* Validate Request
	if (!req.file) return res.status(400).json({ message: "No Image uploaded" });

	//* Get image path
	const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

	//* Upload image to cloudinary
	const imageData = await cloudinaryUploadImage(imagePath);

	//* Get user from database
	const user = await User.findById(req.user.id);

	//* Delete the profile picture if exists
	user.profilePic.publicId &&
		(await cloudinaryRemoveImage(user.profilePic.publicId));

	//* Change the profile picture in the database
	user.profilePic = {
		publicId: imageData.public_id,
		url: imageData.secure_url,
	};
	await user.save();

	//* Sending a response to the client
	res.status(200).json({
		message: "Your profile picture updated successfully",
		profilePic: { url: imageData.secure_url, publicId: imageData.public_id },
	});

	//* Remove the image from the server
	fs.unlinkSync(imagePath);
});

/**_____________________________________________
 * @desc    Delete user
 * @route   /api/users/:id
 * @method  DELETE
 * @access  private //! Only admin & account owner can access this route
________________________________________________*/
module.exports.deleteUserCtrl = asyncHandler(async (req, res) => {
	//* Get user from database
	const user = await User.findById(req.params.id);

	//? Check if user exists
	if (!user) return res.status(404).json({ message: "User not found" });

	//* Get all posts from database
	const posts = await Post.find({ user: user._id });

	//* Get the publicIds from database
	const publicIds = posts?.map((post) => post.image.publicId);

	//* Delete all user's posts images from cloudinary
	publicIds?.length && (await cloudinaryRemoveMultipleImage(publicIds));

	//* Delete user's profile picture from cloudinary
	if (user.profilePic.publicId)
		await cloudinaryRemoveImage(user.profilePic.publicId);

	//* Delete user's posts & comments from database
	await Post.deleteMany({ user: user._id });
	await Comment.deleteMany({ user: user._id });

	//* Delete user from database
	await User.findByIdAndDelete(req.params.id);

	//* Sending a response to the client
	res.status(200).json({ message: "User deleted successfully" });
});
