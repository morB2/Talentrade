const bcrypt = require("bcrypt");
const userDL = require("../DL/user");

// Validate user details
const detailsValidation = (name, email, password) => {
  if (name.trim() !== "" && password.trim() !== "" && email.trim() !== "")
    if (email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/))
      if (password.length >= 4) return true;
  return false;
};

// Register a new user
const registerUser = async (name, email, password) => {
  let role = 'user';
  if (!detailsValidation(name, email, password))
    throw new Error("Incorrect details");
  const user = await userDL.getUserByEmail(email);
  if (user) {
    throw new Error("User already exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    name,
    email,
    password: hashedPassword,
    salt,
    role,
  };
  const createdUser = await userDL.createUser(newUser);
  return createdUser;
};

// Login a user
const loginUser = async (email, password) => {
  const user = await userDL.getUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }
  return user;
};

// Get user details by user ID
const getUserById = async (userId) => {
  const user = await userDL.getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

// Update user profile
const updateUserProfile = async (userId, updatedData) => {
  const user = await userDL.updateUser(userId, updatedData);
  if (!user) {
    throw new Error("User not found or update failed");
  }
  return user;
};

// Change user password
const changePassword = async (userId, currentPassword, newPassword) => {
  if (newPassword.length < 4) {
    return "Password must be at least 4 characters";
  }
  const user = await userDL.getUserById(userId);
  if (!user) {
    return "User not found";
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
     return "Current password is incorrect";
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await userDL.updateUser(userId, { password: hashedPassword, salt });
  return "Password changed successfully";
};

// Like a comment by comment ID and user ID
const reportUser = async (reportedUserId, reporterUserId) => {
  await userDL.reportUser(reportedUserId, reporterUserId);
};

// Add user to received service list
const addUserToReceivedServiceList = (userId, receivedUserId) => {
  return userDL.addUserToReceivedServiceList(userId, receivedUserId);
};

// Export the user functions
module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUserProfile,
  changePassword,
  reportUser,
  addUserToReceivedServiceList,
};