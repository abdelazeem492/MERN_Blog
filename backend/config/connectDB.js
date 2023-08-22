const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.CLOUD_DB_URI);
		console.log("Connected To Database ^_^");
	} catch (err) {
		console.log(err);
	}
};

module.exports = connectDB;
