const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, registerValidation, loginValidation } = require("../models/User");
const VerificationToken = require("../models/VerificationToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

/**_____________________________________________
 * @desc    Register a new user
 * @route   /api/auth/register
 * @method  POST
 * @access  public
________________________________________________*/
module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
	//* Validate Request
	const { error } = registerValidation(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });

	//? Check if user already exists
	let user = await User.findOne({ email: req.body.email });
	if (user) return res.status(400).json({ message: "User already exists" });

	//* Haching the password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	//* Saving the user to the database
	user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: hashedPassword,
	});
	await user.save();

	//* Send Email to verify account
	// Create new VerificationToken and save it in DB
	const verificationToken = new VerificationToken({
		userId: user._id,
		token: crypto.randomBytes(32).toString("hex"),
	});
	await verificationToken.save();

	// Making link to verify account
	const link = `${process.env.FRONTEND_URL}/users/${user._id}/verify/${verificationToken.token}`;

	// put the link in html template
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
					Thank you
					<span style="color: #6099fb"
						>${user.firstName + " " + user.lastName}</span
					>
					for registering for our Blog Website
				</h3>
		<div class="flex justify-center" style="margin: 16px auto; width: 100%">
					<img
						src="https://res.cloudinary.com/dgbokcal4/image/upload/v1692664499/pngwing.com_1_ln8agw.png"
						alt=""
						width="150px"
						style="margin: auto; display: block"
					/>
				</div>

				<p>We're happy you're here. Let's get your email address verified:</p>
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
						>Click to Verify Email</a
					>
					<p class="mt-4 text-sm">
						If you’re having trouble clicking the "Verify Email Address" button,
						copy and paste the URL below into your web browser:
					<a href="${link}" class="text-blue-600 underline">${link}</a>
					</p>
				</div>
			</div>
		</div>
	</body>
</html>
	`;

	// Send email to user
	await sendEmail(user.email, "Verify your email address", htmlTemplate);

	//* Sending a response to the client
	res.status(201).json({
		message: "We sent you an email, please verify your email address",
	});
});

/**_____________________________________________
 * @desc    Login user
 * @route   /api/auth/login
 * @method  POST
 * @access  public
________________________________________________*/
module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
	//* Validate Request
	const { error } = loginValidation(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });

	//? Check if user already exists
	const user = await User.findOne({ email: req.body.email });
	if (!user)
		return res.status(400).json({ message: "Email or password is incorrect" });

	//? Check if password is correct
	const isPasswordCorrect = await bcrypt.compare(
		req.body.password,
		user.password,
	);
	if (!isPasswordCorrect)
		return res.status(400).json({ message: "Email or password is incorrect" });

	//* Send email to verify account if not verified
	if (!user.isVerified) {
		let verificationToken = await VerificationToken.findOne({
			userId: user._id,
		});

		if (!verificationToken) {
			verificationToken = new VerificationToken({
				userId: user._id,
				token: crypto.randomBytes(32).toString("hex"),
			});
			await verificationToken.save();
		}

		// Making link to verify account
		const link = `${process.env.FRONTEND_URL}/users/${user._id}/verify/${verificationToken.token}`;

		// put the link in html template
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
					Thank you
					<span style="color: #6099fb"
						>${user.firstName + " " + user.lastName}</span
					>
					for registering for our Blog Website
				</h3>
		<div class="flex justify-center" style="margin: 16px auto; width: 100%">
					<img
						src="https://res.cloudinary.com/dgbokcal4/image/upload/v1692664499/pngwing.com_1_ln8agw.png"
						alt=""
						width="150px"
						style="margin: auto; display: block"
					/>
				</div>

				<p>We're happy you're here. Let's get your email address verified:</p>
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
						>Click to Verify Email</a
					>
					<p class="mt-4 text-sm">
						If you’re having trouble clicking the "Verify Email Address" button,
						copy and paste the URL below into your web browser:
					<a href="${link}" class="text-blue-600 underline">${link}</a>
					</p>
				</div>
			</div>
		</div>
	</body>
</html>
	`;

		// Send email to user
		await sendEmail(user.email, "Verify your email address", htmlTemplate);

		return res
			.status(400)
			.json({
				message: "We sent you an email, please verify your email address first",
			});
	}

	//* Generating a token => JWT
	const token = user.generateAuthToken();

	//* Sending a response to the client
	res.status(200).json({
		_id: user._id,
		isAdmin: user.isAdmin,
		profilePic: user.profilePic,
		token,
		firstName: user.firstName,
		lastName: user.lastName,
	});
});

/**_____________________________________________
 * @desc    Verify user account
 * @route   /api/auth/:userId/verify/:token
 * @method  GET
 * @access  public
________________________________________________*/
module.exports.verifyUserCtrl = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.userId);
	if (!user)
		return res.status(400).json({ message: "Invalid link or expired" });

	const verificationToken = await VerificationToken.findOne({
		userId: user._id,
		token: req.params.token,
	});

	user.isVerified = true;
	await user.save();

	await VerificationToken.findByIdAndDelete(verificationToken?._id);

	res.status(200).json({ message: "Your account verified successfully" });
});
