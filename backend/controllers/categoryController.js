const asyncHandler = require("express-async-handler");
const { createCategoryValidation, Category } = require("../models/Category");

/**_____________________________________________
 * @desc    Create new category 
 * @route   /api/categories
 * @method  POST
 * @access  private //! Only admin can access this route
________________________________________________*/
module.exports.createCategoryCtrl = asyncHandler(async (req, res) => {
	//* Validate Request
	const { error } = createCategoryValidation(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });

	//? Check if category already exists
	let category = await Category.findOne({ title: req.body.title });
	if (category)
		return res.status(400).json({ message: "Category already exists" });

	//* Create category
	category = new Category({
		title: req.body.title,
		user: req.user.id,
	});
	await category.save();

	//* Send a response to the client
	res.status(201).json(category);
});

/**_____________________________________________
 * @desc    Get all categories
 * @route   /api/categories
 * @method  GET
 * @access  public 
________________________________________________*/
module.exports.getAllCategoriesCtrl = asyncHandler(async (req, res) => {
	//* Get all categories
	const categories = await Category.find().populate("user", [
		"firstName",
		"lastName",
		"profilePic",
	]);

	//* Send a response to the client
	res.status(200).json(categories);
});

/**_____________________________________________
 * @desc    Delete category
 * @route   /api/categories/:id
 * @method  DELETE
 * @access  private //! Only admin can access this route 
________________________________________________*/
module.exports.deleteCategoryCtrl = asyncHandler(async (req, res) => {
	const category = await Category.findByIdAndDelete(req.params.id);
	if (!category) {
		return res.status(404).json({ message: "Category not found" });
	}

	//* Send a response to the client
	res.status(200).json({ message: "Category deleted successfully" });
});
