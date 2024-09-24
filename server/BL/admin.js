const adminDL = require("../DL/admin");

// Get all users
exports.getUsers = async () => {
  return await adminDL.getAllUsers();
};

// Delete a user by user ID
exports.deleteUser = async (userId) => {
  return await adminDL.deleteUser(userId);
};

// Get reporters for a user by user ID
exports.getReporters = async (userId) => {
  return await adminDL.getReporters(userId);
};