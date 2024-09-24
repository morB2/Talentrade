const userDL = require("../DL/user");
const ratingDL = require("../DL/rating");

// Add or update a rating for a user
const addOrUpdateRating = async (userId, raterId, rating) => {
  await ratingDL.addOrUpdateRating(userId, raterId, rating);
  const ratings = await ratingDL.getRatingsForUser(userId);
  const total = ratings.reduce((acc, { rating }) => acc + rating, 0);
  const averageRating = total / ratings.length;
  await userDL.updateUser(userId, { rating: averageRating });
  return averageRating;
};

// Get a specific rating by user and rater
const getRating = async (userId, raterId) => {
  return await ratingDL.getRating(userId, raterId);
};

const canRateUser = async (userId, raterId) => {
  return await ratingDL.hasReceivedServiceFrom(userId, raterId);
};


// Export the rating functions
module.exports = {
  addOrUpdateRating,
  canRateUser,
  getRating,
};