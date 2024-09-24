import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import useApiClient from "./useApiClient.js"; // Import the custom API client hook
import { categories } from "./db"; // Import category data
import "../componentsStyle/CategoryPage.css"; // Import CSS styles for the Category Page

/**
 * CategoryPage component
 * This component displays a list of services based on the selected category, filters, and sorting options.
 * It also allows users to search, filter by subcategories, and sort services.
 */
export default function CategoryPage() {
  // Initialize API client hook
  const apiClient = useApiClient();
  
  // Extract parameters from URL
  let { userId, adminId, category } = useParams();
  userId = adminId || userId; // Use adminId if available
  let { state } = useLocation(); // Get location state
  const navigate = useNavigate(); // Initialize navigation hook
  
  // State variables for managing services, subcategories, search term, sort option, and filter type
  const [services, setServices] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [filterType, setFilterType] = useState("all"); // Default filter type

  // Fetch services when category, sortBy, subcategories, or filterType changes
  useEffect(() => {
    fetchServices();
  }, [category, sortBy, subcategories, filterType]); // Include filterType in dependencies

  /**
   * Fetches services based on the selected category, sorting, subcategories, and filter type.
   */
  const fetchServices = async () => {
    try {
      const queryParams = new URLSearchParams({
        category: category,
        sortBy: sortBy,
        subCategory: subcategories.join(","),
        userID: state,
        filterType: filterType, // Include filterType in query parameters
      }).toString();

      // Make API request to fetch services
      const response = await apiClient.get(`/services/${userId}?${queryParams}`, navigate);
      setServices(response); // Update state with fetched services
    } catch (error) {
      console.error("Error fetching services:", error); // Log error if the fetch fails
    }
  };

  /**
   * Handles search input changes.
   * @param {Event} e - Input change event.
   */
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  /**
   * Handles sorting option changes.
   * @param {Event} e - Select change event.
   */
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  /**
   * Handles subcategory filter changes.
   * @param {Event} e - Checkbox change event.
   */
  const handleSubcategoryChange = (e) => {
    const value = e.target.value;
    setSubcategories(
      e.target.checked
        ? [...subcategories, value]
        : subcategories.filter((sub) => sub !== value)
    );
  };

  /**
   * Handles filter type changes (requests, offers, or all).
   * @param {Event} e - Radio button change event.
   */
  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  // Filter services based on the search term
  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="category-page">
      {/* Page title */}
      <h1 className="page-title">
        {state ? "My Services" : `${category} Services`}
      </h1>
      
      {/* Filters section */}
      <div className="filters">
        {/* Search input */}
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
        />
        
        {/* Sort by select */}
        <select
          className="sort-select"
          onChange={handleSortChange}
          value={sortBy}
        >
          <option value="created_at">Sort by time</option>
          <option value="title">Sort by title</option>
        </select>

        {/* Filter by type (requests, offers, all) */}
        <div className="filter-type">
          <label>
            <input
              type="radio"
              value="all"
              checked={filterType === "all"}
              onChange={handleFilterTypeChange}
            />
            All
          </label>
          <label>
            <input
              type="radio"
              value="requests"
              checked={filterType === "requests"}
              onChange={handleFilterTypeChange}
            />
            Requests
          </label>
          <label>
            <input
              type="radio"
              value="offers"
              checked={filterType === "offers"}
              onChange={handleFilterTypeChange}
            />
            Offers
          </label>
        </div>

        {/* Subcategory filters */}
        <div className="subcategory-filter">
          <p>Subcategories:</p>
          {category === "All"
            ? Object.keys(categories).map((cat) =>
                categories[cat].map((subcat) => (
                  <div key={subcat} className="subcategory-option">
                    <label>
                      <input
                        type="checkbox"
                        value={subcat}
                        checked={subcategories.includes(subcat)}
                        onChange={handleSubcategoryChange}
                      />
                      {subcat}
                    </label>
                  </div>
                ))
              )
            : categories[category].map((subcat) => (
                <div key={subcat} className="subcategory-option">
                  <label>
                    <input
                      type="checkbox"
                      value={subcat}
                      checked={subcategories.includes(subcat)}
                      onChange={handleSubcategoryChange}
                    />
                    {subcat}
                  </label>
                </div>
              ))}
        </div>
      </div>

      {/* List of filtered services */}
      <ul className="service-list">
        {filteredServices.map((service) => (
          <li key={service.id} className="service-item">
            <h3 className="service-title">{service.title}</h3>
            <p className="service-compensation">
              Compensation: {service.compensation}
            </p>
            <Link to={`services/${service.id}`} className="view-details-link">
              View Details
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
