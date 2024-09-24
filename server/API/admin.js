const express = require("express");
const router = express.Router();
const adminBL = require("../BL/admin");

// Route to get all users
router.get("/users", async (req, res) => {
  try {
    const users = await adminBL.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
});

// Route to delete a user by ID
router.delete("/:userId/users", async (req, res) => {
  try {
    const { userId } = req.params;
    await adminBL.deleteUser(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
});

// Route to get reporters for a user by user ID
router.get("/users/:userId/reporters", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const reporters = await adminBL.getReporters(userId);
    res.status(200).json(reporters);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reporters", error: error.message });
  }
});

module.exports = router;
