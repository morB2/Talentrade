const db = require('../dbConfig'); // Assume db is set up to use your SQL connection

// Retrieve comments by service ID
const getCommentsByServiceId = async (serviceId) => {
  const [results] = await db.query('SELECT * FROM comments WHERE serviceId = ?', [serviceId]);
  return results;
};

// Retrieve a comment by its ID
const getCommentById = async (commentId) => {
  const [results] = await db.query('SELECT * FROM comments WHERE id = ?', [commentId]);
  return results[0];
};

// Add a new comment
const addComment = async (comment) => {
  const [result] = await db.query('INSERT INTO comments (serviceId, userId, text, likes) VALUES (?, ?, ?, ?)', 
  [comment.serviceId, comment.userId, comment.text, JSON.stringify([])]);
  return result.insertId;
};

// Update an existing comment by ID
const updateComment = async (commentId, text) => {
  await db.query('UPDATE comments SET text = ? WHERE id = ?', [text, commentId]);
};

// Delete a comment by ID
const deleteComment = async (commentId) => {
  await db.query('DELETE FROM comments WHERE id = ?', [commentId]);
};

// Delete all comments for a specific service ID
const deleteAllComment = async (serviceId) => {
  await db.query('DELETE FROM comments WHERE serviceId = ?', [serviceId]);
};

// Like a comment
const likeComment = async (commentId, userId) => {
  const [result] = await db.query('SELECT likes FROM comments WHERE id = ?', [commentId]);
  const [likes] = result;
  if (likes.likes.length == 0 || !likes.likes.includes(userId)) {
    likes.likes.push(userId);
    await db.query('UPDATE comments SET likes = ? WHERE id = ?', [JSON.stringify(likes.likes), commentId]);
  }
};

// Unlike a comment
const unlikeComment = async (commentId, userId) => {
  const [result] = await db.query('SELECT likes FROM comments WHERE id = ?', [commentId]);
  let [likes] = result;
  likes = likes.likes;
  const index = likes.indexOf(userId);
  if (index > -1) {
    likes.splice(index, 1);
    await db.query('UPDATE comments SET likes = ? WHERE id = ?', [JSON.stringify(likes), commentId]);
  }
};

// Retrieve all comments
const getAllComments = async () => {
  const [rows] = await db.query("SELECT * FROM comments");
  return rows;
};

module.exports = {
  getCommentsByServiceId,
  addComment,
  updateComment,
  deleteComment,
  deleteAllComment,
  likeComment,
  unlikeComment,
  getAllComments,
  getCommentById,
};