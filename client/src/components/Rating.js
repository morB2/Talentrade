import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useApiClient from "./useApiClient"; // Import the API client

/**
 * Rating component
 * Allows users to rate another user and displays the updated average rating.
 *
 * @param {Object} props - The component props.
 * @param {string} props.profileUserId - The ID of the user being rated.
 * @param {Function} props.setUser - Function to update the user state with the new rating.
 */
export default function Rating({ profileUserId, setUser }) {
  const apiClient = useApiClient();
  const [rating, setRating] = useState(0); // State to store the user's rating
  const [message, setMessage] = useState("");
  const [canRate, setCanRate] = useState(false); // State to store if the user can rate
  let { userId,adminId } = useParams(); // Get the current user ID from URL parameters
  const raterId = userId || adminId; // ID of the user who is rating
  userId = userId || adminId;
  
  // Fetch the user's current rating when the component mounts
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const queryParams = new URLSearchParams({
          profileUserId: profileUserId,
          userId: userId,
        }).toString();
        const response = await apiClient.get(`/rate/${userId}?${queryParams}`);
        if (response && response.rating) {
          setRating(response.rating); // Set the rating state with the current rating
        }
      } catch (error) {
        console.error("Failed to fetch rating:", error);
      }
    };
    fetchRating();
  }, [profileUserId, raterId, apiClient]);

  // Check if the user can be rated when the component mounts
  useEffect(() => {
    const checkIfCanRate = async () => {
      try {
        const response = await apiClient.get(
          `/rate/${userId}/canRate?profileId=${profileUserId}&userId=${userId}`
        );
        setCanRate(response.canRate);
      } catch (error) {
        console.error("Failed to check if can rate:", error);
      }
    };
    checkIfCanRate();
  }, [profileUserId]);

  /**
   * Handles the rating submission.
   * Sends a POST request to update the rating and then updates the component state.
   *
   * @param {number} newRating - The new rating value.
   */
  const handleRating = async (newRating) => {
    try {
      // Send a POST request to rate the user
      const data = await apiClient.post(`/rate/${userId}`, {
        profileUserId,
        raterId,
        rating: newRating,
      });
      // Update the local state with the new rating
      setRating(newRating);
      setUser((prevUser) => ({ ...prevUser, rating: data.averageRating }));
      // Display a success message with the new average rating
      setMessage(`Rating updated!`);
    } catch (error) {
      // Display an error message if the request fails
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      {canRate && 
        <>
          <p>Rate this user:</p>
          <div>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{
                  cursor: "pointer",
                  color: rating >= star ? "gold" : "grey",
                }} // Change color based on rating
                onClick={() => handleRating(star)} // Handle star click to submit rating
              >
                ★
              </span>
            ))}
          </div>
        </>}
      <p>{message}</p> {/* Display success or error message */}
    </div>
  );
}
