const commentsDL = require("../DL/comments");
const jwt = require("../JWT.JS");

const checkValidation = async (userId, commentId) => {
  const comment = await commentsDL.getCommentById(commentId);  
  return comment.userId == userId;
};

// Get comments by service ID
const getCommentsByServiceId = async (serviceId) => {
  return await commentsDL.getCommentsByServiceId(serviceId);
};

// Add a comment to a service
const addComment = async (comment) => {
  comment.likes = JSON.stringify([]); // Initialize likes to an empty array
  return await commentsDL.addComment(comment);
};

// Update a comment by comment ID
const updateComment = async (commentId, text) => {
  await commentsDL.updateComment(commentId, text);
};

// Delete a comment by user ID and comment ID
const deleteComment = async (commentId) => {
  return await commentsDL.deleteComment(commentId);
};

// Delete all comments for a service by service ID
const deleteAllComment = async (serviceId) => {
  await commentsDL.deleteAllComment(serviceId);
};

// Like a comment by comment ID and user ID
const likeComment = async (commentId, userId) => {
  await commentsDL.likeComment(commentId, userId);
};

// Unlike a comment by comment ID and user ID
const unlikeComment = async (commentId, userId) => {
  await commentsDL.unlikeComment(commentId, userId);
};

// Export the comment functions
module.exports = {
  getCommentsByServiceId,
  addComment,
  updateComment,
  deleteComment,
  deleteAllComment,
  likeComment,
  checkValidation,
  unlikeComment,
};
