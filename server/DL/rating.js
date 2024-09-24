const db = require("../dbConfig");

// Add or update a rating for a user
const addOrUpdateRating = async (userId, raterId, rating) => {
  const [rows] = await db.query(
    "INSERT INTO ratings (user_id, rater_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?",
    [userId, raterId, rating, rating]
  );
  return rows;
};

// Retrieve ratings for a specific user
const getRatingsForUser = async (userId) => {
  const [rows] = await db.query("SELECT rating FROM ratings WHERE user_id = ?", [userId]);
  return rows;
};

const getRating = async (userId, raterId) => {
  const [rows] = await db.query('SELECT rating FROM ratings WHERE user_id = ? AND rater_id = ?', [userId, raterId]);  
  return rows[0];
};

// Check if the user has received a service from the rater
const hasReceivedServiceFrom = async (userId, raterId) => {
  if(!userId || !raterId)
    return false;
  const query = `
    SELECT JSON_CONTAINS(received_service_ids, ?, '$') AS hasReceived
    FROM users
    WHERE id = ?;
  `;
  const [results] = await db.query(query, [JSON.stringify(raterId), userId]); 
  if(results[0]) 
    return results[0].hasReceived;
}

module.exports = {
  hasReceivedServiceFrom,
  addOrUpdateRating,
  getRatingsForUser,
  getRating,
};
