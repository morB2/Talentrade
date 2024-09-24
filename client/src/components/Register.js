import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useApiClient from "./useApiClient"; // Import the API client
import "../componentsStyle/Register.css";

/**
 * Register component
 * Allows new users to create an account by providing their email, name, and password.
 */
export default function Register() {
  const apiClient = useApiClient();
  // State hooks for form fields and error messages
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [verifiedPassword, setVerifiedPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  /**
   * Handles form submission.
   * Validates input fields and sends a POST request to register the user.
   * 
   * @param {Event} e - The form submit event.
   */
  function handleSubmit(e) {
    e.preventDefault();
    if (!detailsValidation()) return;

    apiClient
      .post(`/users/register`, {
        name: name,
        email: email,
        password: password,
      })
      .then((data) => {
        // Navigate to the user's home page or admin page based on user role
        if (data.userRole === "admin") {
          navigate(`/admin/${data.userId}`);
        } else {
          navigate(`/users/${data.userId}`);
        }
      })
      .catch((error) => {
        // Display error message if registration fails
        setError(error.message);
      });
  }

  /**
   * Validates user input fields.
   * Checks for empty fields, valid email, password length, and matching passwords.
   * 
   * @returns {boolean} - Returns true if all validations pass, otherwise false.
   */
  const detailsValidation = () => {
    if (
      name.trim() !== "" &&
      password.trim() !== "" &&
      verifiedPassword.trim() !== ""
    ) {
      if (email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
        if (password.length >= 4) {
          if (password === verifiedPassword) return true;
          else setError("Make sure the passwords are the same!");
        } else setError("Password must be at least 4 characters");
      } else setError("Please enter a valid email address");
    } else setError("Please make sure you filled all the fields.");
    return false;
  };

  return (
    <div className="container">
      <h1>SIGN UP</h1>
      <form onSubmit={handleSubmit} className="registerForm">
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          onClick={() => setError("")}
          className="registerInput"
          required
        />
        <input
          type="text"
          placeholder="Enter your name..."
          onChange={(e) => setName(e.target.value)}
          onClick={() => setError("")}
          className="registerInput"
          required
        />
        <input
          type="password"
          placeholder="Enter your password..."
          onChange={(e) => setPassword(e.target.value)}
          onClick={() => setError("")}
          className="registerInput"
          required
        />
        <input
          type="password"
          placeholder="Verify your password..."
          onChange={(e) => setVerifiedPassword(e.target.value)}
          onClick={() => setError("")}
          className="registerInput"
          required
        />
        <p className="error">{error}</p> {/* Display error messages */}
        <button type="submit" className="registerButton">
          Sign Up
        </button>
      </form>
      <p className="p_link">
        Already have an account?{" "}
        <Link to="/login" className="link">
          Log In
        </Link>
      </p>
    </div>
  );
}
