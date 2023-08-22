const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
	const authToken = req.headers.authorization;
	if (authToken) {
		const token = authToken.split(" ")[1];
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = decoded;
			next();
		} catch (error) {
			return res.status(401).json({ message: "Unauthorized - invalid token" });
		}
	} else {
		res.status(401).json({ message: "Unauthorized - No token provided" });
	}
};

const verifyAdminToken = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.user.isAdmin) next();
		else
			return res
				.status(403)
				.json({ message: "Only admin can access this route" });
	});
};

const verifyAccountOwnerToken = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.user.id === req.params.id) next();
		else
			return res
				.status(403)
				.json({ message: "Only account owner can access this route" });
	});
};

const verifyAdminAndOwnerToken = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.user.id === req.params.id || req.user.isAdmin) next();
		else
			return res
				.status(403)
				.json({ message: "Only admin & account owner can access this route" });
	});
};

module.exports = {
	verifyToken,
	verifyAdminToken,
	verifyAccountOwnerToken,
	verifyAdminAndOwnerToken,
};
