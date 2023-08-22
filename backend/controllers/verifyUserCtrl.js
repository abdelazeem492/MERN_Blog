const asyncHandler = require("express-async-handler");
const { User } = require("../models/User");
const VerificationToken = require("../models/VerificationToken");

/**_____________________________________________
 * @desc    Verify user account
 * @route   /api/auth/:userId/verify/:token
 * @method  GET
 * @access  public
________________________________________________*/
module.exports.verifyUserCtrl = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.userId);
	if (!user)
		return res.status(400).json({ message: "Invalid link (user not found)" });

	const verificationToken = await VerificationToken.findOne({
		userId: user._id,
		token: req.params.token,
	});

	if (!verificationToken)
		return res.status(400).json({ message: "Invalid link (token not found)" });

	user.isVerified = true;
	await user.save();

	await verificationToken.remove();

	res.status(200).json({ message: "Your account verified successfully" });
});
