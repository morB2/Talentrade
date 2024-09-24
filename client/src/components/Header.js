import React, { useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import "../componentsStyle/Header.css";
import useApiClient from "./useApiClient"; // Import the API client

/**
 * Header component
 * Displays the navigation menu based on whether the user is an admin or a regular user.
 * Provides links to various pages and handles user logout functionality.
 */
export default function Header() {
  // Create an instance of the API client
  const apiClient = useApiClient();

  // Extract userId or adminId from URL parameters
  let { userId, adminId } = useParams();
  userId = userId || adminId; // Use userId if present, otherwise use adminId

  // State to toggle the visibility of the menu on mobile devices
  const [menuVisible, setMenuVisible] = useState(false);

  // Toggle the visibility of the menu
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  /**
   * Handles user logout by making an API request to the logout endpoint.
   */
  const logout = async () => {
    try {
      await apiClient.post(`/users/${userId}/logout`, {});
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <header>
        <div className="logo">
          TalentTrade
          <button className="menu-toggle" onClick={toggleMenu}>
            ☰
          </button>
        </div>
        <nav className={menuVisible ? "visible" : "hidden"}>
          <ul>
            {/* Render different links based on whether adminId is present */}
            {adminId ? (
              <li>
                <Link to={`/admin/${userId}`}>Home</Link>
              </li>
            ) : (
              <>
                <li>
                  <Link to={`/users/${userId}`}>Home</Link>
                </li>
                <li>
                  <Link to="about">About</Link>
                </li>
                <li>
                  <Link to="request">Request service</Link>
                </li>
                <li>
                  <Link to= "offer">Offer service</Link>
                </li>
                {/* Show profile, sign-up, and login links based on whether userId is present */}
                {userId !== ":userId" ? (
                  <li>
                    <Link to="profile">Profile</Link>
                  </li>
                ) : (
                  <>
                    <li>
                      <Link to="/register">SignUp</Link>
                    </li>
                    <li>
                      <Link to="/login">Login</Link>
                    </li>
                  </>
                )}
              </>
            )}
            {/* Show logout link if userId is present */}
            {userId !== ":userId" && (
              <li>
                <Link to="/" onClick={logout}>
                  LogOut
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <Outlet /> {/* Render nested routes here */}
    </>
  );
}
