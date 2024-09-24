import axios from "axios";
import { useNavigate } from "react-router-dom";

// Custom hook to provide API client functionality
const useApiClient = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate to different routes

  /**
   * Makes an HTTP request using axios.
   *
   * @param {string} url - The URL to send the request to.
   * @param {string} method - The HTTP method to use (GET, POST, PUT, DELETE).
   * @param {object|null} data - The data to send with the request (optional).
   * @param {object} headers - Additional headers to include with the request (optional).
   * @returns {Promise<any>} - The response data from the request.
   * @throws {Error} - Throws an error if the request fails.
   */
  const makeRequest = async (
    url,
    method = "GET",
    data = null,
    headers = {}
  ) => {
    try {
      // Determine the content type based on the data type
      const contentType =
        data instanceof FormData ? "multipart/form-data" : "application/json";

      // Make the HTTP request using axios
      const response = await axios({
        url,
        method,
        headers: {
          "Content-Type": contentType,
          ...headers,
        },
        data,
        withCredentials: true, // Include credentials (cookies) with the request
      });

      // Check if the response status is successful
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw new Error(response.statusText); // Throw error if status is not successful
      }
    } catch (error) {
      if (error.response) {
        // Handle HTTP errors with status codes
        const statusCode = error.response.status;
        if ([500, 404, 403].includes(statusCode))
          navigate("/error", { state: { message: statusCode } }); // Redirect to error page with status code
        
      }
      console.error("Axios error:", error);
        throw new Error(error.response.data.message);
    }
  };

  // Return an object with methods for making HTTP requests
  return {
    get: (url, headers = {}) =>
      makeRequest("http://localhost:5000" + url, "GET", null, headers),
    post: (url, data, headers = {}) =>
      makeRequest("http://localhost:5000" + url, "POST", data, headers),
    put: (url, data, headers = {}) =>
      makeRequest("http://localhost:5000" + url, "PUT", data, headers),
    delete: (url, data, headers = {}) =>
      makeRequest("http://localhost:5000" + url, "DELETE", data, headers),
  };
};

export default useApiClient;
