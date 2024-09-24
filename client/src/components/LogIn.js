import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useApiClient from "./useApiClient"; // Import the API client
import "../componentsStyle/LogIn.css";

/**
 * LogIn component
 * Provides a form for users to log in. It handles user input, sends login requests to the server, and navigates to different routes based on user roles.
 */
export default function LogIn() {
  // API client instance for making requests
  const apiClient = useApiClient();
  // State hooks for managing email, password, and error message
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // Hook for programmatic navigation
  const navigate = useNavigate();

  /**
   * Handles form submission for logging in.
   * Sends a POST request to the server with email and password.
   * Navigates to the appropriate route based on user role or sets an error message.
   * 
   * @param {Object} e - The form submit event.
   */
  const handleLogIn = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (userEmail.trim() === "" || password.trim() === "") return; // Check if inputs are empty

    try {
      // Send login request to the server
      const response = await apiClient.post(`/users/login`, {
        email: userEmail,
        password: password,
      });
      
      // Navigate based on user role
      if (response.userRole === "admin") {
        navigate(`/admin/${response.userId}`);
      } else {
        navigate(`/users/${response.userId}`);
      }
    } catch (error) {
      // Set error message if login fails
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-header">Log In</h1>
      <form className="login-form" onSubmit={handleLogIn}>
        {/* Email input field */}
        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={userEmail}
          onChange={(event) => setUserEmail(event.target.value)}
        />
        {/* Password input field */}
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {/* Display error message if login fails */}
        <p className="error-message">{errorMessage}</p>
        {/* Submit button */}
        <button type="submit" className="login-button">
          Log In
        </button>
      </form>
      {/* Link to the registration page */}
      <p className="register-text">
        Don't have an account?{" "}
        <Link to="../register" className="register-link">
          Register here
        </Link>
      </p>
    </div>
  );
}
