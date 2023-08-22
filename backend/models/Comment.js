const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const joi = require("joi");

const CommentSchema = new Schema(
	{
		postId: {
			type: Schema.Types.ObjectId,
			ref: "Post",
			required: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		userInfo: {
			type: Object,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const Comment = mongoose.model("Comment", CommentSchema);

//* Create comment validation
const createCommentValidation = (obj) => {
	const schema = joi.object({
		postId: joi.string().required(),
		text: joi.string().required().trim(),
	});
	return schema.validate(obj);
};

//* Create comment validation
const updateCommentValidation = (obj) => {
	const schema = joi.object({
		text: joi.string().required().trim(),
	});
	return schema.validate(obj);
};

module.exports = {
	Comment,
	createCommentValidation,
	updateCommentValidation,
};
