const cloudinary = require("cloudinary");

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

//* Cloudinary Upload Image
const cloudinaryUploadImage = async (image) => {
	try {
		const imageData = await cloudinary.uploader.upload(image, {
			resource_type: "auto",
		});
		return imageData;
	} catch (error) {
		console.log(error);
		throw new Error(
			"Internal Server Error - Cannot upload image - Check your internet connection",
		);
	}
};

//* Cloudinary Remove Image
const cloudinaryRemoveImage = async (imagePublicId) => {
	try {
		const result = await cloudinary.uploader.destroy(imagePublicId);
		return result;
	} catch (error) {
		console.log(error);
		throw new Error("Internal Server Error - Unable to remove image");
	}
};

//* Cloudinary Remove Multiple Image
const cloudinaryRemoveMultipleImage = async (publicIds) => {
	try {
		const result = await cloudinary.v2.api.delete_resources(publicIds);
		return result;
	} catch (error) {
		console.log(error);
		throw new Error("Internal Server Error - Unable to remove images");
	}
};

module.exports = {
	cloudinaryUploadImage,
	cloudinaryRemoveImage,
	cloudinaryRemoveMultipleImage,
};
