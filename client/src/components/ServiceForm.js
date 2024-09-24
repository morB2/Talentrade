import React, { useState } from "react";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import useApiClient from "./useApiClient"; // Import the API client
import { categories } from "./db";
import "../componentsStyle/ServiceForm.css";

export default function ServiceForm() {
  const apiClient = useApiClient(); // Custom API client hook
  const [title, setTitle] = useState(""); // State for the service title
  const [description, setDescription] = useState(""); // State for the service description
  const [category, setCategory] = useState(""); // State for the service category
  const [subcategories, setSubcategories] = useState([]); // State for selected subcategories
  const [compensation, setCompensation] = useState(""); // State for the compensation description
  const [successMessage, setSuccessMessage] = useState(""); // State for displaying success message
  const location = useLocation(); // Hook to get current location
  const navigate = useNavigate(); // Hook to programmatically navigate
  const serviceType = location.pathname.includes("request") ? "request" : "offer"; // Determine if it's a request or offer form
  const { userId } = useParams(); // Get userId from URL parameters

  // Handle category change and reset selected subcategories
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSubcategories([]);
  };

  // Handle subcategory selection and deselection
  const handleSubcategoryChange = (e) => {
    const value = e.target.value;
    setSubcategories(
      e.target.checked
        ? [...subcategories, value]
        : subcategories.filter((sub) => sub !== value)
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send form data to the server
      const response = await apiClient.post(
        `/services/${userId}`,
        {
          title,
          description,
          category,
          subcategories,
          compensation,
          type: serviceType,
          userId: userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      setSuccessMessage("Your request has been successfully submitted!"); // Set success message
      setTimeout(() => navigate("../"), 2000); // Redirect to the previous page after 2 seconds
    } catch (error) {
      console.error("Failed to create service:", error);
    }
  };

  return (
    <div className="service-form-container">
      {/* Check if userId is valid */}
      {userId === ":userId" ? (
        <div className="login-prompt">
          <h1>You need to log in first</h1>
          <Link to="/register" className="link">Register</Link>
          <br />
          <Link to="/login" className="link">Log In</Link>
        </div>
      ) : (
        <div className="service-form">
          <h1>{serviceType === "request" ? "Request a Service" : "Offer a Service"}</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="input-field"
            />
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="input-field"
            />
            <select value={category} onChange={handleCategoryChange} className="input-field">
              <option value="">Select Category</option>
              {Object.keys(categories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {category && (
              <div className="subcategories">
                <p>Subcategories:</p>
                {categories[category].map((subcat) => (
                  <div key={subcat} className="subcategory-option">
                    <label>
                      <input
                        type="checkbox"
                        value={subcat}
                        checked={subcategories.includes(subcat)}
                        onChange={handleSubcategoryChange}
                        className="checkbox-input"
                      />
                      {subcat}
                    </label>
                  </div>
                ))}
              </div>
            )}
            <textarea
              name="compensation"
              value={compensation}
              onChange={(e) => setCompensation(e.target.value)}
              placeholder="Compensation (e.g., money, another service)"
              className="input-field"
              required
            />
            <button type="submit" className="submit-button">Submit</button>
            {/* Display success message if present */}
            {successMessage && <p className="success-message">{successMessage}</p>}
          </form>
        </div>
      )}
    </div>
  );
}
