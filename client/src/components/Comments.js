import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useApiClient from "./useApiClient"; // Import the custom API client hook
import "../componentsStyle/comments.css"; // Import CSS styles for comments
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

/**
 * Comments component
 * This component handles displaying and managing comments for a specific item.
 * Users can add, edit, delete, and like/unlike comments.
 */
export default function Comments({ serviceOpen, serviceUserId, serviceType }) {
  const apiClient = useApiClient(); // Initialize the API client hook
  let { userId, adminId, id } = useParams(); // Extract URL parameters
  userId = adminId || userId; // Use adminId if available

  // State variables for managing comments, new comment input, editing state, and edited comment input
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [editedComment, setEditedComment] = useState("");

  // Fetch comments when the `id` parameter changes
  useEffect(() => {
    fetchComments();
  }, [id]);

  /**
   * Fetches comments for the specific item.
   */
  const fetchComments = async () => {
    try {
      const response = await apiClient.get(`/comments/${userId}/${id}`);
      setComments(response); // Update state with fetched comments
    } catch (error) {
      console.error("Error fetching comments:", error); // Log error if the fetch fails
    }
  };

  /**
   * Handles adding a new comment.
   */
  const handleAddComment = async () => {
    if (newComment.trim() == "") return;
    try {
      await apiClient.post(`/comments/${userId}/${id}`, {
        text: newComment,
        userId,
      });
      setNewComment(""); // Clear the input
      fetchComments(); // Refresh comments list
    } catch (error) {
      console.error("Error adding comment:", error); // Log error if the add fails
    }
  };

  /**
   * Handles deleting a comment.
   * @param {string} commentId - The ID of the comment to delete.
   */
  const handleDeleteComment = async (commentId) => {
    try {
      await apiClient.delete(`/comments/${userId}/${id}/${commentId}`, {
        userId,
      });
      fetchComments(); // Refresh comments list
    } catch (error) {
      console.error("Error deleting comment:", error); // Log error if the delete fails
    }
  };

  /**
   * Initiates editing mode for a specific comment.
   * @param {string} commentId - The ID of the comment to edit.
   * @param {string} text - The current text of the comment to edit.
   */
  const handleEditComment = (commentId, text) => {
    setIsEditing(commentId); // Set editing mode for the comment
    setEditedComment(text); // Set the current text for editing
  };

  /**
   * Saves the edited comment.
   * @param {string} commentId - The ID of the comment to save.
   */
  const handleSaveEditComment = async (commentId) => {
    try {
      await apiClient.put(`/comments/${userId}/${id}/${commentId}`, {
        userId,
        text: editedComment,
      });
      setIsEditing(null); // Exit editing mode
      setEditedComment(""); // Clear edited comment input
      fetchComments(); // Refresh comments list
    } catch (error) {
      console.error("Error editing comment:", error); // Log error if the edit fails
    }
  };

  /**
   * Handles liking a comment.
   * @param {string} commentId - The ID of the comment to like.
   */
  const handleLikeComment = async (commentId) => {
    try {
      await apiClient.post(`/comments/${userId}/${id}/${commentId}/like`, {
        userId,
      });
      fetchComments(); // Refresh comments list
    } catch (error) {
      console.error("Error liking comment:", error); // Log error if the like fails
    }
  };

  /**
   * Handles unliking a comment.
   * @param {string} commentId - The ID of the comment to unlike.
   */
  const handleUnlikeComment = async (commentId) => {
    try {
      await apiClient.post(`/comments/${userId}/${id}/${commentId}/unlike`, {
        userId,
      });
      fetchComments(); // Refresh comments list
    } catch (error) {
      console.error("Error unliking comment:", error); // Log error if the unlike fails
    }
  };

  /**
   * Checks if a comment is liked by the current user.
   * @param {Array} likes - Array of user IDs who liked the comment.
   * @returns {boolean} - True if the current user has liked the comment, false otherwise.
   */
  const isCommentLiked = (likes) => {
    if (likes.length !== 0) return likes.includes(userId);
    return false;
  };

  /**
   * Handles accepting a comment.
   * @param {string} commentId - The ID of the comment to accept.
   */
  const handleAcceptComment = async (commentUserId) => {
    try {
      if (serviceType == "offer")
        await apiClient.post(`/users/${userId}/receivedService`, {
          user: userId,
          received: commentUserId,
        });
      else
        await apiClient.post(`/users/${userId}/receivedService`, {
          user: commentUserId,
          received: userId,
        });
      fetchComments(); // Refresh comments list
    } catch (error) {
      console.error("Error accepting comment:", error); // Log error if the accept fails
    }
  };

  return (
    <div className="comments-section">
      <h3>Comments</h3>

      {/* Input for adding a new comment */}
      {userId !== ":userId" && serviceOpen ? (
        <div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
          />
          <button onClick={handleAddComment}>Add Comment</button>
        </div>
      ) : (
        ""
      )}

      {/* Display list of comments */}
      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <p>
            <strong>{comment.userId === -1 ? "User Deleted" : ""}</strong>
          </p>

          {/* Comment editing interface */}
          {isEditing == comment.id ? (
            <div>
              <textarea
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
              />
              <button onClick={() => handleSaveEditComment(comment.id)}>
                Save
              </button>
              <button onClick={() => setIsEditing(null)}>Cancel</button>
            </div>
          ) : (
            <div>
              <p>{comment.text}</p>
              <p>
                Likes: {comment.likes.length !== 0 ? comment.likes.length : 0}
              </p>
              {comment.userId !== -1 && comment.userId != userId && (
                <>
                  <Link
                    to={`/users/${userId}/profile`}
                    className="link"
                    state={comment.userId}
                  >
                    View User's Profile
                  </Link>
                  <br />
                </>
              )}

              {/* Like/Unlike button */}
              {userId != ":userId" &&
                comment.userId != userId &&
                comment.userId !== -1 ? (
                  <>
                    <button
                      className={`like-button ${
                        isCommentLiked(comment.likes) ? "liked" : "unliked"
                      }`}
                      onClick={() =>
                        isCommentLiked(comment.likes)
                          ? handleUnlikeComment(comment.id)
                          : handleLikeComment(comment.id)
                      }
                    >
                      <FontAwesomeIcon icon={faThumbsUp} />
                    </button>
                    <br />
                  </>
                ):("")}

              {/* Edit/Delete buttons for the comment author */}
              {comment.userId == userId && (
                <button
                  onClick={() => handleEditComment(comment.id, comment.text)}
                >
                  Edit
                </button>
              )}

              {/* Delete button for admin */}
              {adminId ||
                comment.userId == userId ? (
                  <>
                    <button onClick={() => handleDeleteComment(comment.id)}>
                      Delete
                    </button>
                  </>
                ):("")}
              {/* Accept button for service owner */}
              {userId != ":userId" &&
                userId == serviceUserId &&
                comment.userId !== -1 &&
                userId != comment.userId && (
                  <button onClick={() => handleAcceptComment(comment.userId)}>
                    Accept
                  </button>
                )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
