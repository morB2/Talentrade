const db = require("../dbConfig");

// Create a new user
const createUser = async (user) => {
  const [result] = await db.query(
    "INSERT INTO users (username, email, password, salt, role) VALUES (?, ?, ?, ?, ?)",
    [user.name, user.email, user.password, user.salt, user.role]
  );
  return { id: result.insertId, ...user };
};

// Retrieve a user by email
const getUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

// Retrieve a user by ID
const getUserById = async (userId) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
  return rows[0];
};

// Update user details by ID
const updateUser = async (userId, updatedData) => {
  const [result] = await db.query("UPDATE users SET ? WHERE id = ?", [
    updatedData,
    userId,
  ]);
  if (result.affectedRows === 0) {
    return null;
  }
  return getUserById(userId);
};

// report
const reportUser = async (reportedUserId, reporterUserId) => {
  
  const [result] = await db.query("SELECT report_ids FROM users WHERE id = ?", [
    reportedUserId,
  ]);
  
  let [reports] = result;

  if (!reports.report_ids) reports.report_ids = [];

  if (reports.report_ids.length == 0 || !reports.report_ids.includes(reporterUserId)) {
    reports.report_ids.push(reporterUserId);
    
    await db.query("UPDATE users SET report_ids = ? WHERE id = ?", [
      JSON.stringify(reports.report_ids),
      reportedUserId,
    ]);
  }
};

// Add user to received service list
const addUserToReceivedServiceList = async (userId, receivedUserId) => {
  // Ensure the user has a valid JSON array for received_service_ids
  const initQuery = `
    UPDATE users
    SET received_service_ids = CASE
      WHEN received_service_ids IS NULL THEN JSON_ARRAY()
      ELSE received_service_ids
    END
    WHERE id = ?;
  `;

  await db.query(initQuery, [userId]);

  // Add the receivedUserId to the array
  const appendQuery = `
    UPDATE users
    SET received_service_ids = JSON_ARRAY_APPEND(received_service_ids, '$', ?)
    WHERE id = ? AND NOT JSON_CONTAINS(received_service_ids, ?, '$');
  `;

  await db.query(appendQuery, [receivedUserId, userId, JSON.stringify(receivedUserId)]);
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  reportUser,
  addUserToReceivedServiceList,
};
