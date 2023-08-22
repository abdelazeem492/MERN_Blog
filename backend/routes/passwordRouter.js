const {
	sendResetPasswordLinkCtrl,
	getResetPasswordLinkCtrl,
	resetPasswordCtrl,
} = require("../controllers/passwordController");

const router = require("express").Router();

//* Send reset password link => /api/password/reset-password
router.post("/reset-password", sendResetPasswordLinkCtrl);

//* Get reset password link => /api/password/reset-password/:userId/:token
router.get("/reset-password/:userId/:token", getResetPasswordLinkCtrl);

//* Reset password => /api/password/reset-password/:userId/:token
router.post("/reset-password/:userId/:token", resetPasswordCtrl);

module.exports = router;
