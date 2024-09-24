const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const router = express.Router();
const userBL = require("../BL/user");
const adminBL = require("../BL/admin");
const jwtToken = require("../JWT.JS");
const path = require("path");
const fs = require("fs");

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // Directory for uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // File naming convention
  },
});

const upload = multer({ storage: storage });

// Route to register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await userBL.registerUser(name, email, password);

    const token = jwtToken.generateToken(result);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(201).json({ userId: result.id, userRole: result.role });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to login a user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userBL.loginUser(email, password);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwtToken.generateToken(user);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(200).json({ userId: user.id, userRole: user.role });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// Route to get user profile by user ID
router.get(
  "/:userId/profile/:currentUser",
  jwtToken.authenticateToken,
  jwtToken.checkUserId,
  async (req, res) => {
    try {
      const { currentUser } = req.params;

      const user = await userBL.getUserById(currentUser);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Route to update user profile with optional file uploads
router.put(
  "/profile/:userId",
  jwtToken.authenticateToken,
  jwtToken.checkUserId,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const updatedData = req.body.user ? JSON.parse(req.body.user) : {};

      const user = await userBL.getUserById(userId); // Retrieve user by ID
      if (
        req.files["profilePicture"] &&
        user.profilePicture &&
        user.profilePicture.startsWith("/uploads/")
      ) {
        // Delete the old profile picture if it exists and is a file upload
        fs.unlinkSync(path.join(__dirname, "..", user.profilePicture));
      }
      if (req.files["profilePicture"]) {
        updatedData.profilePicture = `/uploads/${req.files["profilePicture"][0].filename}`;
      }

      if (req.files["resume"]) {
        if (user.resume) {
          // Delete the old resume
          fs.unlinkSync(path.join(__dirname, "..", user.resume));
        }
        updatedData.resume = `/uploads/${req.files["resume"][0].filename}`;
      }

      const updatedUser = await userBL.updateUserProfile(userId, updatedData);
      res.status(200).json(updatedUser);
    } catch (error) {
      console.log(error);

      res.status(400).json({ message: error.message });
    }
  }
);

// Route to change user password
router.put(
  "/:userId/change-password",
  jwtToken.authenticateToken,
  jwtToken.checkUserId,
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.userId;
      const message = await userBL.changePassword(userId, currentPassword, newPassword);
      res.status(200).json({ message: message });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Route to report a user
router.post(
  "/:userId/report",
  jwtToken.authenticateToken,
  jwtToken.checkUserId,
  async (req, res) => {
    try {
      await userBL.reportUser(req.body.currentUser, req.params.userId);
      res.status(201).json({ message: "Report submitted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to report user", error: error.message });
    }
  }
);

// Route to logout a user
router.post(
  "/:userId/logout",
  jwtToken.authenticateToken,
  jwtToken.checkUserId,
  (req, res) => {
    try {
      res.cookie("jwt", "", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        expires: new Date(0), // Set cookie expiry to past date
      });
      res.status(200).send("Logged out");
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Add user to received service list
router.post(
  "/:userId/receivedService",
  jwtToken.authenticateToken,
  jwtToken.checkUserId,
  async (req, res) => {
    try {
      await userBL.addUserToReceivedServiceList(
        req.body.user,
        req.body.received
      );
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  "/:userId/deleteAccount",
  jwtToken.authenticateToken,
  jwtToken.checkUserId,
  async (req, res) => {
    try {
      await adminBL.deleteUser(req.params.userId);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
