const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const joi = require("joi");

const CategorySchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true },
);

const Category = mongoose.model("Category", CategorySchema);

//* Create category validation
const createCategoryValidation = (obj) => {
	const schema = joi.object({
		title: joi.string().trim().required(),
	});
	return schema.validate(obj);
};

module.exports = {
	createCategoryValidation,
	Category,
};
