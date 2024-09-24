import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ErrorPage component
 * Displays an error message based on the status code provided in the location state.
 * Handles common HTTP errors like 403 Forbidden and 404 Not Found.
 */
const ErrorPage = () => {
  // Use useLocation to access the state passed to this page
  const location = useLocation();
  const { state } = location;
  const message = state?.message; // Extract the error message from the state

  // Default error message
  let errorMessage = "Something went wrong. Please try again later.";

  // Customize error message based on the status code
  if (message == '403') {
    errorMessage = "You shall not pass! (403 Forbidden)";
  } else if (message == '404') {
    errorMessage = "Looks like you're lost. (404 Not Found)";
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Oops! Something went wrong.</h1>
      <p style={{ fontSize: '24px', color: 'red' }}>{errorMessage}</p>
      {message &&<p>status code: {message}</p>}
      <a href="/">Back to Home</a> {/* Link to navigate back to the home page */}
    </div>
  );
};

export default ErrorPage;
