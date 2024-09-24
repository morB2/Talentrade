const express = require("express");
const router = express.Router();
const commentsBL = require("../BL/comments");

// Route to get comments for a specific service by service ID
router.get("/:id", async (req, res) => {
  try {
    const comments = await commentsBL.getCommentsByServiceId(req.params.id);
    res.json(comments);
  } catch (error) {
    res.status(500).send("Error fetching comments");
  }
});

// Route to add a comment to a service
router.post("/:id", async (req, res) => {
  try {
    const comment = {
      serviceId: req.params.id,
      userId: req.body.userId,
      text: req.body.text,
    };
    if (comment.text.trim() == "") throw new Error("empty comment");
    const commentId = await commentsBL.addComment(comment);
    res.status(201).json({ id: commentId });
  } catch (error) {
    res.status(500).json("Error adding comment");
  }
});

// Route to edit a comment by comment ID
router.put("/:serviceId/:commentId", async (req, res) => {
  try {
    if (
      await commentsBL.checkValidation(req.body.userId, req.params.commentId)
    ) {
      await commentsBL.updateComment(req.params.commentId, req.body.text);
      res.send("Comment updated");
    }
  } catch (error) {
    res.status(500).send("Error updating comment");
  }
});

// Route to delete a comment by comment ID
router.delete("/:serviceId/:commentId", async (req, res) => {
  try {
    const {commentId } = req.params;
    if (
      (await commentsBL.checkValidation(req.body.userId, commentId)) ||
      jwt.checkAdmin
    ) {
      await commentsBL.deleteComment(commentId);
      res.send("Comment deleted");
    }
  } catch (error) {
    res.status(500).send("Error deleting comment");
  }
});

// Route to like a comment by comment ID
router.post("/:serviceId/:commentId/like", async (req, res) => {
  try {
    await commentsBL.likeComment(req.params.commentId, req.body.userId);
    res.send("Comment liked");
  } catch (error) {
    res.status(500).send("Error liking comment");
  }
});

// Route to unlike a comment by comment ID
router.post("/:serviceId/:commentId/unlike", async (req, res) => {
  try {
    await commentsBL.unlikeComment(req.params.commentId, req.body.userId);
    res.send("Comment unliked");
  } catch (error) {
    res.status(500).send("Error unliking comment");
  }
});

module.exports = router;
