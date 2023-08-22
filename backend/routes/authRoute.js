const router = require("express").Router();
const {
	registerUserCtrl,
	loginUserCtrl,
	verifyUserCtrl,
} = require("../controllers/authController");

//* Register => /api/auth/register
router.post("/register", registerUserCtrl);

//* Login => /api/auth/login
router.post("/login", loginUserCtrl);

//* Verify user account => /api/auth/:userId/verify/:token
router.get("/:userId/verify/:token", verifyUserCtrl);

module.exports = router;
