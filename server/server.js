const express = require("express");
const cookieParser = require("cookie-parser");
const userAPI = require("./API/user");
const servicesAPI = require("./API/services");
const commentsAPI = require("./API/comments");
const bodyParser = require("body-parser");
const ratingAPI = require("./API/rating");
const jwt = require("./JWT.JS");
const cors = require("cors");
const adminAPI = require("./API/admin");
const path = require('path');

const app = express();
const port = 5000;

// Enable CORS for requests from the specified origin
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Allow credentials (cookies) to be included in requests
  })
);

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Middleware to parse incoming request bodies in JSON format
app.use(bodyParser.json());

// Route handlers for different endpoints
app.use("/users", userAPI);
app.use("/admin/:adminId", jwt.authenticateToken, jwt.checkUserId, jwt.checkAdmin, adminAPI);
app.use("/rate/:userId", jwt.authenticateToken, jwt.checkUserId, ratingAPI);
app.use("/services/:userId", jwt.authenticateToken, jwt.checkUserId, servicesAPI);
app.use("/comments/:userId", jwt.authenticateToken, jwt.checkUserId, commentsAPI);

// Serve static files from the 'uploads' directory
app.use('/videos', express.static(path.join(__dirname, 'videos')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
