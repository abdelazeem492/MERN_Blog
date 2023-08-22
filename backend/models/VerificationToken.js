const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VerificationTokenSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		token: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const VerificationToken = mongoose.model(
	"VerificationToken",
	VerificationTokenSchema,
);

module.exports = VerificationToken;
