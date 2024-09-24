import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useApiClient from "./useApiClient.js"; // Import the API client
import { categories } from "./db";
import Comments from "./Comments";
import "../componentsStyle/ServiceDetails.css";

/**
 * ServiceDetails Component
 * Displays details of a specific service and allows editing and deleting by the owner.
 * Handles fetching, updating, and deleting service data.
 */
export default function ServiceDetails() {
  const apiClient = useApiClient();
  let { userId, adminId, id } = useParams();
  userId = adminId || userId; // Set userId to adminId if adminId is present
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [isOpen,setIsOpen] = useState();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subcategories: [],
    compensation: "",
  });

  // Fetch service details when the component mounts or id changes
  useEffect(() => {
    fetchServiceDetails();
  }, [id]);

  // Fetch service details from the API
  const fetchServiceDetails = async () => {
    try {
      const response = await apiClient.get(`/services/${userId}/${id}`);
      setService(response);
      setFormData({
        title: response.title,
        description: response.description,
        category: response.category,
        subcategories: response.subcategories,
        compensation: response.compensation,
      });
      setIsOpen(service.is_open);
      setSubcategories(response.subcategories);
    } catch (error) {
      console.error("Error fetching service details:", error);
    }
  };

  // Handle deleting the service
  const handleDelete = async () => {
    try {
      await apiClient.delete(`/services/${userId}/${id}`, {userId});
      navigate("../"); // Redirect to the home page after deletion
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  // Handle enabling edit mode
  const handleEdit = () => {
    setEditMode(true);
  };

  // Handle saving the updated service details
  const handleSave = async () => {
    try {
      await apiClient.put(`/services/${userId}/${id}`,{userId, formData});
      setEditMode(false);
      fetchServiceDetails(); // Refresh the data after saving
    } catch (error) {
      console.error("Error saving service details:", error);
    }
  };

  // Handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, category: value, subcategories: [] });
  };

  // Handle subcategory selection
  const handleSubcategoryChange = (e) => {
    const { value, checked } = e.target;
    const updatedSubcategories = checked
      ? [...formData.subcategories, value]
      : formData.subcategories.filter((sub) => sub !== value);
    setSubcategories(updatedSubcategories);
    setFormData({ ...formData, subcategories: updatedSubcategories });
  };

  const handleToggleStatus = async () => {
    try {
      await apiClient.post(`/services/${userId}/${id}/status`, { isOpen: !service.is_open,userId });
      fetchServiceDetails();
    } catch (error) {
      console.error("Error toggling service status:", error);
    }
  };

  // Show loading text if service data is not yet available
  if (!service || userId == null) return <div>Loading...</div>;

  const isOwner = service.userId == userId;

  return (
    <div className="service-details-container">
      {/* Display service title with an input field if in edit mode */}
      <h1>
        {editMode ? (
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="editable-input"
          />
        ) : (
          service.title
        )}
      </h1>
      <p>
        <strong>Status:</strong> {service.is_open ? "Open" : "Closed"}
      </p>
      {/* Display service owner */}
      <p className="service-owner">By: {service.userName}</p>

      {/* Display service description with a textarea if in edit mode */}
      <p>
        {editMode ? (
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="editable-textarea"
          />
        ) : (
          service.description
        )}
      </p>
      {/* Display service category with a select field if in edit mode */}
      <p>

        <strong>Category:{" "}</strong>
        {editMode ? (
          <select
            value={formData.category}
            onChange={handleCategoryChange}
            className="editable-select"
          >
            <option value="">Select Category</option>
            {Object.keys(categories).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        ) : (
          service.category
        )}
      </p>
      {/* Display subcategories with checkboxes if in edit mode */}
      <p>
        <strong>Subcategories:{" "}</strong>
        {editMode
          ? categories[formData.category]?.map((subcat) => (
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
            ))
          : service.subcategories.join(", ")}
      </p>
      {/* Display compensation with an input field if in edit mode */}
      <p>
        <strong>Compensation:{" "}</strong>
        {editMode ? (
          <input
            type="text"
            name="compensation"
            value={formData.compensation}
            onChange={handleChange}
            className="editable-input"
          />
        ) : (
          service.compensation
        )}
      </p>
      
      {/* Display contact information */}
      <p><strong>Email: </strong>{service.userEmail}</p>

      {/* Display action buttons based on ownership */}
      {isOwner ? (
        <div className="action-buttons">
          {editMode ? (
            <button onClick={handleSave} >
              Save
            </button>
          ) : (
            <button onClick={handleEdit}>
              Edit
            </button>
          )}
          <button
            onClick={handleDelete}
            className="action-button delete-button"
          >
            Delete
          </button>
          <button onClick={handleToggleStatus}>
            {service.is_open ? "Close Service" : "Open Service"}
          </button>
        </div>
      ) : adminId ? (
        <>
          <button
            onClick={handleDelete}
            className="action-button delete-button"
          >
            Delete
          </button>
          <Link
            to={`/admin/${adminId}/profile`}
            className="link"
            state={service.userId}
          >
            View User's Profile
          </Link>
        </>
      ) : (
        <Link
          to={`/users/${userId}/profile`}
          className="link"
          state={service.userId}
        >
          View User's Profile
        </Link>
      )}
      {/* Display comments section */}
      <Comments serviceOpen={service.is_open} serviceUserId={service.userId} serviceType={service.type}/>
    </div>
  );
}
