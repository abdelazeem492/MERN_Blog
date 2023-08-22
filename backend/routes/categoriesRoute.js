const router = require("express").Router();
const {
	createCategoryCtrl,
	getAllCategoriesCtrl,
	deleteCategoryCtrl,
} = require("../controllers/categoryController");
const validateObjectId = require("../middlewares/validateObjectId");
const { verifyAdminToken } = require("../middlewares/verifyToken");

//* Create new category => /api/categories
router.post("/", verifyAdminToken, createCategoryCtrl); //! Admin only

//* Get all categories => /api/categories
router.get("/", getAllCategoriesCtrl);

//* Delete category => /api/categories/:id
router.delete("/:id", validateObjectId, verifyAdminToken, deleteCategoryCtrl); //! Admin only

module.exports = router;
