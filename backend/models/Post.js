const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const joi = require("joi");

const PostSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		category: {
			type: String,
			required: true,
			trim: true,
		},
		image: {
			type: Object,
			default: {
				url: "",
				publicId: null,
			},
		},
		likes: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);
//* Populate comments for the post
PostSchema.virtual("comments", {
	ref: "Comment",
	localField: "_id",
	foreignField: "postId",
});

const Post = mongoose.model("Post", PostSchema);

//* Create post validation
const createPostValidation = (obj) => {
	const schema = joi.object({
		title: joi.string().trim().required(),
		description: joi.string().trim().required(),
		category: joi.string().trim().required(),
	});
	return schema.validate(obj);
};

//* Update post validation
const updatePostValidation = (obj) => {
	const schema = joi.object({
		title: joi.string().trim(),
		description: joi.string().trim(),
		category: joi.string().trim(),
	});
	return schema.validate(obj);
};

module.exports = {
	Post,
	createPostValidation,
	updatePostValidation,
};
