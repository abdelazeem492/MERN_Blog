const express = require("express");
const connectDB = require("./config/connectDB");
const { errorHandler, notFoundHandler } = require("./middlewares/errorHandler");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiting = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
require("dotenv").config();

//* Connect to Database
connectDB();

//* Initialize Express
const app = express();

//*  Middlewares
app.use(express.json());
app.use(helmet());
app.use(hpp()); //* HTTP Parameter Pollution
app.use(xss()); //! Cross Site Scripting
app.use(
	rateLimiting({
		windowMs: 15 * 60 * 1000, //! 10 minutes
		max: 150,
	}),
);

app.use(
	cors({
		origin: [process.env.FRONTEND_URL, "https://mernbblog.vercel.app"],
	}),
);

//* Import Routes
app.use("/api/auth", require("./routes/authRoute")); //* register & login
app.use("/api/users", require("./routes/usersRoute")); //* users
app.use("/api/posts", require("./routes/postsRoute")); //* posts
app.use("/api/comments", require("./routes/commentsRoute")); //* comments
app.use("/api/categories", require("./routes/categoriesRoute")); //* categories
app.use("/api/password", require("./routes/passwordRouter")); //* password

//* Not Found Handler
app.use(notFoundHandler);

//* Error Handler
app.use(errorHandler);

//* Running Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
