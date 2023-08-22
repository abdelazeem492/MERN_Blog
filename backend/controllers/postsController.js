const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const {
	createPostValidation,
	Post,
	updatePostValidation,
} = require("../models/Post");
const {
	cloudinaryUploadImage,
	cloudinaryRemoveImage,
} = require("../utils/cloudinary");
const { Comment } = require("../models/Comment");

/**_____________________________________________
 * @desc    Create new post 
 * @route   /api/posts
 * @method  POST
 * @access  private //! Only logged in user can access this route
________________________________________________*/
module.exports.createPostCtrl = asyncHandler(async (req, res) => {
	//* Validate Request
	const { error } = createPostValidation(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });

	//* Upload image to cloudinary
	const imagePath = req.file
		? path.join(__dirname, `../images/${req.file.filename}`)
		: null;
	const imageData = await cloudinaryUploadImage(imagePath);

	//* Create new post
	const post = new Post({
		title: req.body.title,
		description: req.body.description,
		category: req.body.category,
		user: req.user.id,
		image: {
			url: imageData.secure_url,
			publicId: imageData.public_id,
		},
	});
	await post.save();

	//* Send a response to the client
	res.status(201).json(post);

	//* Remove the image from the server
	fs.unlinkSync(imagePath);
});

/**_____________________________________________
 * @desc    Get all posts
 * @route   /api/posts
 * @method  GET
 * @access  public 
________________________________________________*/
module.exports.getAllPostsCtrl = asyncHandler(async (req, res) => {
	const POSTS_PER_PAGE = 10;
	const { pageNumber, category } = req.query;
	let posts;
	if (pageNumber)
		posts = await Post.find()
			.skip((pageNumber - 1) * POSTS_PER_PAGE)
			.limit(POSTS_PER_PAGE)
			.sort({ createdAt: -1 })
			.populate("user", ["firstName", "lastName", "profilePic"])
			.populate("comments");
	else if (category)
		posts = await Post.find({ category })
			.sort({ createdAt: -1 })
			.populate("user", ["firstName", "lastName", "profilePic"])
			.populate("comments");
	else
		posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate("user", ["firstName", "lastName", "profilePic"])
			.populate("comments");
	res.status(200).json(posts);
});

/**_____________________________________________
 * @desc    Get post by id
 * @route   /api/posts/:id
 * @method  GET
 * @access  public 
________________________________________________*/
module.exports.getPostByIdCtrl = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.id)
		.populate("comments")
		.populate("user", ["firstName", "lastName", "profilePic"]);
	if (!post) return res.status(404).json({ message: "Post not found" });

	res.status(200).json(post);
});

/**_____________________________________________
 * @desc    Get posts count
 * @route   /api/posts/count
 * @method  GET
 * @access  public
________________________________________________*/
module.exports.getPostsCountCtrl = asyncHandler(async (req, res) => {
	const postsCount = await Post.count();
	res.status(200).json({ postsCount });
});

/**_____________________________________________
 * @desc    Delete post
 * @route   /api/posts/:id
 * @method  DELETE
 * @access  private //! Only admin & post owner can access this route
________________________________________________*/
module.exports.deletePostCtrl = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.id);
	if (!post) return res.status(404).json({ message: "Post not found" });

	if (req.user.isAdmin || req.user.id === post.user.toString()) {
		await Post.findByIdAndDelete(req.params.id);
		await cloudinaryRemoveImage(post.image.publicId);

		//* Delete comments
		await Comment.deleteMany({ postId: post._id });

		res.status(200).json({ message: "Post deleted successfully" });
	} else
		res
			.status(403)
			.json({ message: "Only admin & post owner can access this route" });
});

/**_____________________________________________
 * @desc    Update post
 * @route   /api/posts/:id
 * @method  PUT
 * @access  private //! Only post owner can access this route
________________________________________________*/
module.exports.updatePostCtrl = asyncHandler(async (req, res) => {
	//* Validate Request
	const { error } = updatePostValidation(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });

	//? Check if post exists
	const post = await Post.findById(req.params.id);
	if (!post) return res.status(404).json({ message: "Post not found" });

	//? Check if post belongs to the logged in user
	if (post.user.toString() !== req.user.id)
		return res
			.status(403)
			.json({ message: "Only post owner can access this route" });

	//* Update post
	const updatedPost = await Post.findByIdAndUpdate(
		req.params.id,
		{
			$set: {
				title: req.body.title,
				description: req.body.description,
				category: req.body.category,
			},
		},
		{ new: true },
	)
		.populate("user", ["firstName", "lastName", "profilePic"])
		.populate("comments");

	//* Send a response to the client
	res.status(200).json(updatedPost);
});

/**_____________________________________________
 * @desc    Update post image
 * @route   /api/posts/upload-image/:id
 * @method  PUT
 * @access  private //! Only post owner can access this route
________________________________________________*/
module.exports.updatePostImageCtrl = asyncHandler(async (req, res) => {
	//* Validate Request
	if (!req.file) return res.status(400).json({ message: "No image uploaded" });

	//? Check if post exists
	const post = await Post.findById(req.params.id);
	if (!post) return res.status(404).json({ message: "Post not found" });

	//? Check if post belongs to the logged in user
	if (post.user.toString() !== req.user.id)
		return res
			.status(403)
			.json({ message: "Only post owner can access this route" });

	//* delete post image from cloudinary
	await cloudinaryRemoveImage(post.image.publicId);

	//* Upload image to cloudinary
	const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
	const imageData = await cloudinaryUploadImage(imagePath);

	//* Update post image
	const updatedPost = await Post.findByIdAndUpdate(
		req.params.id,
		{
			$set: {
				image: {
					url: imageData.secure_url,
					publicId: imageData.public_id,
				},
			},
		},
		{ new: true },
	);

	//* Send a response to the client
	res.status(200).json(updatedPost);

	//* Remove the image from the server
	fs.unlinkSync(imagePath);
});

/**_____________________________________________
 * @desc    Toggle like
 * @route   /api/posts/like/:id
 * @method  PUT
 * @access  private //! Only logged in user can access this route
________________________________________________*/
module.exports.toggleLikeCtrl = asyncHandler(async (req, res) => {
	//? Check if post exists
	let post = await Post.findById(req.params.id);
	if (!post) return res.status(404).json({ message: "Post not found" });

	//? Check if post already liked by the logged in user
	const loggedInUser = req.user.id;
	const isLiked = post.likes.includes(loggedInUser);
	if (isLiked)
		post = await Post.findByIdAndUpdate(
			req.params.id,
			{
				$pull: { likes: loggedInUser },
			},
			{ new: true },
		);
	else
		post = await Post.findByIdAndUpdate(
			req.params.id,
			{
				$push: { likes: loggedInUser },
			},
			{ new: true },
		);

	//* Send a response to the client
	res.status(200).json(post);
});
