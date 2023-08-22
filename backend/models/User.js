const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const jwt = require("jsonwebtoken");

const UserSchema = new Schema(
	{
		firstName: {
			type: String,
			required: [true, "First Name is required"],
			trim: true,
			minlength: [3, "First Name must be at least 3 characters"],
		},
		lastName: {
			type: String,
			required: [true, "Last Name is required"],
			trim: true,
			minlength: [3, "Last Name must be at least 3 characters"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: [true, "Email already exists"],
			trim: true,
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				"Please add a valid email",
			],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [8, "Password must be at least 8 characters"],
			trim: true,
		},
		profilePic: {
			type: Object,
			default: {
				url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
				publicId: null,
			},
		},
		bio: String,
		isAdmin: {
			type: Boolean,
			default: false,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
		},
		toObject: {
			virtuals: true,
		},
	},
);

//* Populate posts that belongs to the user
UserSchema.virtual("posts", {
	ref: "Post",
	localField: "_id",
	foreignField: "user",
});

//* Generating a token => JWT
UserSchema.methods.generateAuthToken = function () {
	return jwt.sign(
		{ id: this._id, isAdmin: this.isAdmin },
		process.env.JWT_SECRET,
	);
};

const User = mongoose.model("User", UserSchema);

//* Register Validation
const registerValidation = (obj) => {
	const schema = joi.object({
		firstName: joi.string().trim().min(2).required(),
		lastName: joi.string().trim().min(3).required(),
		email: joi.string().trim().min(5).email().required(),
		password: passwordComplexity().required(),
	});
	return schema.validate(obj);
};

//* Login Validation
const loginValidation = (obj) => {
	const schema = joi.object({
		email: joi.string().trim().min(5).email().required(),
		password: passwordComplexity().required(),
	});
	return schema.validate(obj);
};

//* Update User Validation
const updateUserValidation = (obj) => {
	const schema = joi.object({
		firstName: joi.string().trim().min(2),
		lastName: joi.string().trim().min(2),
		password: passwordComplexity(),
		bio: joi.string(),
	});
	return schema.validate(obj);
};

//* Email Validation
const emailValidation = (obj) => {
	const schema = joi.object({
		email: joi.string().trim().min(5).email().required(),
	});
	return schema.validate(obj);
};

//* Password Validation
const passwordValidation = (obj) => {
	const schema = joi.object({
		password: passwordComplexity().required(),
	});
	return schema.validate(obj);
};

module.exports = {
	User,
	registerValidation,
	loginValidation,
	updateUserValidation,
	emailValidation,
	passwordValidation,
};
