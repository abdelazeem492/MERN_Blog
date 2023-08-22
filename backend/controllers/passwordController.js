const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, emailValidation, passwordValidation } = require("../models/User");
const VerificationToken = require("../models/VerificationToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

/**_____________________________________________
 * @desc    Send email to reset password
 * @route   /api/password/reset-password
 * @method  POST
 * @access  public
________________________________________________*/
module.exports.sendResetPasswordLinkCtrl = asyncHandler(async (req, res) => {
	//* Validate Request
	const { error } = emailValidation(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });

	//? Check if user already exists
	const user = await User.findOne({ email: req.body.email });
	if (!user)
		return res.status(404).json({
			message: "No user has this email, please enter your email correctly",
		});

	//* Create new VerificationToken and save it in DB
	let verificationToken = await VerificationToken.findOne({ userId: user._id });
	if (!verificationToken) {
		verificationToken = new VerificationToken({
			userId: user._id,
			token: crypto.randomBytes(32).toString("hex"),
		});
		await verificationToken.save();
	}

	//* Create link
	const link = `${process.env.FRONTEND_URL}/reset-password/${user._id}/${verificationToken.token}`;

	//* Creating html template
	const htmlTemplate = `
	<html>
	<head>
		<style>
			.flex {
				display: flex;
			}

			.items-center {
				align-items: center;
			}

			.justify-center {
				justify-content: center;
			}

			.min-h-screen {
				min-height: 100vh;
			}

			.p-5 {
				padding: 1.25rem;
			}

			.bg-blue-100 {
				background-color: #8fc2ff;
			}

			.min-w-screen {
				min-width: 100vw;
			}

			.max-w-xl {
				max-width: 36rem;
			}

			.p-8 {
				padding: 2rem;
			}

			.text-center {
				text-align: center;
			}

			.text-gray-800 {
				color: #2d3748;
			}

			.bg-white {
				background-color: #ffffff;
			}

			.shadow-xl {
				box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
			}

			.lg\:max-w-3xl {
				max-width: 48rem;
			}

			.lg\:p-12 {
				padding: 3rem;
			}

			.text-2xl {
				font-size: 1.2rem;
				line-height: 2rem;
			}

			.w-24 {
				width: 6rem;
			}

			.h-24 {
				height: 6rem;
			}

			.text-green-400 {
				color: #5d76f5;
			}

			.justify-center {
				justify-content: center;
			}

			.mt-4 {
				margin-top: 1rem;
			}

			.px-2 {
				padding-left: 0.5rem;
				padding-right: 0.5rem;
			}

			.py-2 {
				padding-top: 0.5rem;
				padding-bottom: 0.5rem;
			}

			.text-blue-200 {
				color: #a3bffa;
			}

			.bg-blue-600 {
				background-color: #4077b4;
			}

			.rounded {
				border-radius: 0.25rem;
			}

			.mt-4 {
				margin-top: 1rem;
			}

			.text-sm {
				font-size: 0.875rem;
				line-height: 1.25rem;
			}

			.text-blue-600 {
				color: #2563eb;
			}

			.underline {
				text-decoration: underline;
			}
			a {
				text-decoration: none;
			}
		</style>
	</head>
	<body style="max-width: 100vw; margin: 0">
		<div
			class="flex items-center justify-center p-5 bg-blue-100"
			style="width: 100%; margin: auto"
		>
			<div
				class="max-w-xl p-8 text-center text-gray-800 bg-white shadow-xl lg:max-w-3xl rounded-3xl lg:p-12"
				style="border-radius: 10px; margin: auto"
			>
				<h3 class="text-2xl">
					Hello
					<span style="color: #6099fb"
						>${user.firstName + " " + user.lastName}</span
					>
					are you sure you want to reset your password?
				</h3>
		<div class="flex justify-center" style="margin: 16px auto; width: 100%">
					<img
						src="https://res.cloudinary.com/dgbokcal4/image/upload/v1692664499/pngwing.com_1_ln8agw.png"
						alt=""
						width="150px"
						style="margin: auto; display: block"
					/>
				</div>

		<p>If you're sure, click the button below to reset your password</p>
				<div class="mt-4">
					<a
						href="${link}"
						class="px-2 py-2 bg-blue-600 rounded"
						style="
							color: white;
							padding: 12px;
							margin: 16px auto;
							display: block;
							width: fit-content;
						"
						>Click to reset your password</a>
					<p class="mt-4 text-sm">
					If you’re having trouble clicking the "Reset Password" button,
						copy and paste the URL below into your web browser:
					<a href="${link}" class="text-blue-600 underline">${link}</a>
					</p>
				</div>
			</div>
		</div>
	</body>
</html>
	`;

	//* Sending email
	await sendEmail(user.email, "Reset your password", htmlTemplate);

	//* Sending response to the client
	res.status(200).json({
		message: "Please check your email to reset your password",
	});
});

/**_____________________________________________
 * @desc    Get reset password link
 * @route   /api/password/reset-password/:userId/:token
 * @method  GET
 * @access  public
________________________________________________*/
module.exports.getResetPasswordLinkCtrl = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.userId);
	if (!user) {
		return res.status(400).json({ message: "Invalid link" });
	}

	const verificationToken = await VerificationToken.findOne({
		userId: user._id,
		token: req.params.token,
	});
	if (!verificationToken) {
		return res.status(400).json({ message: "Invalid link" });
	}

	res.status(200).json({
		message: "Valid link, let's reset your password",
	});
});

/**_____________________________________________
 * @desc    Reset password link
 * @route   /api/password/reset-password/:userId/:token
 * @method  POST
 * @access  public
________________________________________________*/
module.exports.resetPasswordCtrl = asyncHandler(async (req, res) => {
	//* Validate Request
	const { error } = passwordValidation(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });

	//* Check if user exists
	const user = await User.findById(req.params.userId);
	if (!user) {
		return res.status(400).json({ message: "Invalid link" });
	}

	//* Create new VerificationToken and save it in DB
	let verificationToken = await VerificationToken.findOne({
		userId: user._id,
		token: req.params.token,
	});
	if (!verificationToken) {
		return res.status(400).json({ message: "Invalid link" });
	}

	if (!user.isVerified) {
		user.isVerified = true;
	}

	//* Hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	user.password = hashedPassword;
	await user.save();
	await VerificationToken.findOneAndDelete({ userId: user._id });

	res.status(200).json({
		message: "Password reset successfully, please login",
	});
});
