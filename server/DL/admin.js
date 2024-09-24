const db = require("../dbConfig");
const fs = require('fs');

// Retrieve all users
const getAllUsers = async () => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE role = 'user' AND id != -1 ORDER BY JSON_LENGTH(report_ids) DESC"
  );
  return rows;
};

// Get reporters for a user by user ID
const getReporters = async (userId) => {
  const query = `
      SELECT id, username, email
      FROM users
      WHERE JSON_SEARCH(
        (SELECT report_ids FROM users WHERE id = ?),
        'one',
        CAST(id AS CHAR)
      ) IS NOT NULL
    `;
  const [rows] = await db.execute(query, [userId]);
  return rows;
};

//delete user
const deleteUser = async (userId) => {
  try {
    // Get the user by ID to retrieve the profile picture and resume paths
    const [user] = await db.query(
      "SELECT profilePicture, resume FROM users WHERE id = ?",
      [userId]
    );
    if (!user) {
      throw new Error("User not found");
    }

    // Delete the profile picture if it exists
    if (user.profilePicture && user.profilePicture.startsWith("/uploads/")) {
      const profilePicPath = path.join(__dirname, "..", user.profilePicture);
      if (fs.existsSync(profilePicPath)) {
        fs.unlinkSync(profilePicPath);
      }
    }

    // Delete the resume if it exists
    if (user.resume && user.resume.startsWith("/uploads/")) {
      const resumePath = path.join(__dirname, "..", user.resume);
      if (fs.existsSync(resumePath)) {
        fs.unlinkSync(resumePath);
      }
    }

    // Update all comments by the user to be linked to the system user
    await db.query("UPDATE comments SET userId = -1 WHERE userId = ?", [
      userId,
    ]);

    // Get all services by the user
    const [services] = await db.query(
      "SELECT id FROM services WHERE userId = ?",
      [userId]
    );

    // Delete all comments for each service
    for (let service of services) {
      await db.query("DELETE FROM comments WHERE serviceId = ?", [service.id]);
    }

    // Delete all services by the user
    await db.query("DELETE FROM services WHERE userId = ?", [userId]);

    // Delete all ratings involving the user
    await db.query("DELETE FROM ratings WHERE user_id = ? OR rater_id = ?", [
      userId,
      userId,
    ]);

    // Delete the user itself
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [userId]);

    return result.affectedRows;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
};

module.exports = {
  deleteUser,
  getAllUsers,
  getReporters,
};
