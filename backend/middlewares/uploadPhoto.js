const path = require("path");
const multer = require("multer");

//* Photo storage
const photoStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, "../images"));
	},
	filename: (req, file, cb) => {
		file
			? cb(
					null,
					new Date().toISOString().replace(/:/g, "-") + file.originalname,
			  )
			: cb(null, false);
	},
});

//* Photo upload middleware
const photoUpload = multer({
	storage: photoStorage,
	fileFilter: (req, file, cb) => {
		file.mimetype == "image/png" ||
		file.mimetype == "image/jpg" ||
		file.mimetype == "image/jpeg"
			? cb(null, true)
			: cb({ message: "Only .png, .jpg and .jpeg format allowed!" }, false);
	},
	limits: {
		fileSize: 1024 * 1024 * 5, // 5MB
	},
});

module.exports = photoUpload;
