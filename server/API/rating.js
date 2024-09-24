const express = require("express");
const router = express.Router();
const ratingBL = require("../BL/rating");

router.get("/", async (req, res) => {
  // const { userId } = req.params;
  const { profileUserId, userId } = req.query;

  try {
    const rating = await ratingBL.getRating(profileUserId, userId);
    res.status(200).json(rating);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch rating", error: error.message });
  }
});

// Route to add or update a rating
router.post("/", async (req, res) => {
  try {
    const { profileUserId, raterId, rating } = req.body;
    const averageRating = await ratingBL.addOrUpdateRating(
      profileUserId,
      raterId,
      rating
    );
    res
      .status(200)
      .json({ message: "Rating updated successfully", averageRating });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Endpoint to check if a user can be rated
router.get("/canRate", async (req, res) => {
  try {
    const userId = req.query.userId;
    const profileId = req.query.profileId;
    const result = await ratingBL.canRateUser(profileId, userId);
    res.json({ canRate: result });
  } catch (error) {
    console.error("Error checking if user can be rated:", error);
    res.status(500).json({ error: "Error checking if user can be rated" });
  }
});

module.exports = router;
