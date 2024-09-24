import React, { useState, useEffect } from "react";
import useApiClient from "./useApiClient.js"; // Custom hook for API interactions
import "../componentsStyle/AdminPanel.css"; // Importing CSS styles for the Admin Panel
import { Link, useParams } from "react-router-dom"; // Importing React Router components

/**
 * AdminPanel component
 * This component allows administrators to manage users, including viewing user details and deleting users.
 */
export default function AdminPanel() {
  // Initialize API client hook
  const apiClient = useApiClient();

  // State to store users data and message for notifications
  const [users, setUsers] = useState([]);
  const [reporters, setReporters] = useState([]);
  const [message, setMessage] = useState("");

  // Extract adminId from URL parameters
  const { adminId } = useParams();

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   * Fetches the list of users from the server.
   */
  const fetchUsers = async () => {
    try {
      // Make API request to fetch users
      const response = await apiClient.get(`/admin/${adminId}/users`);
      setUsers(response); // Update state with fetched users
    } catch (error) {
      // Log error and set message if the fetch fails
      console.error("Failed to fetch users:", error);
    }
  };

  /**
   * Fetches the list of reporters for a specific user.
   * @param {number} userId - ID of the user to fetch reporters for.
   */
  const fetchReporters = async (userId) => {
    try {
      // Make API request to fetch reporters
      const response = await apiClient.get(
        `/admin/${adminId}/users/${userId}/reporters`
      );
      setReporters(response); // Update state with fetched reporters
    } catch (error) {
      // Log error and set message if the fetch fails
      console.error("Failed to fetch reporters:", error);
    }
  };

  /**
   * Deletes a user based on userId.
   * @param {number} userId - ID of the user to delete.
   */
  const deleteUser = async (userId) => {
    try {
      // Make API request to delete user
      await apiClient.delete(`/admin/${adminId}/${userId}/users`, {
        data: "data",
      });
      setMessage("User deleted successfully"); // Update message on successful deletion
      fetchUsers(); // Refetch users to update the list
    } catch (error) {
      // Set message and log error if deletion fails
      setMessage("Failed to delete user");
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div className="admin-panel">
      {/* Admin Panel Header */}
      <h1>Admin Panel</h1>
      {/* Display notification message */}
      <p>{message}</p>

      {/* Section for managing users */}
      <section>
        <h2>Manage Users</h2>
        <ul className="all-user">
          {users.map((user) => (
            <li key={user.id}>
              {/* Display user details */}
              {user.username} <br />
              {user.email} <br />
              {/* Link to view user profile */}
              Reports: {user.report_ids ? user.report_ids.length || 1 : 0}
              <br />
              <div>
                <Link to="profile" state={user.id}>
                  view details
                </Link>
                {/* Button to delete user */}
                <button onClick={() => deleteUser(user.id)}>Delete</button>
                {/* Button to fetch and display reporters */}
                {user.report_ids && (
                  <button onClick={() => fetchReporters(user.id)}>
                    Reports
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Section for displaying reporters */}
      {reporters.length > 0 && (
        <section>
          <h2>Reporters</h2>
          <ul>
            {reporters.map((reporter) => (
              <li key={reporter.id}>
                {reporter.username} <br />
                {reporter.email}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
