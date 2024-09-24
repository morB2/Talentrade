import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "../componentsStyle/Profile.css";
import useApiClient from "./useApiClient.js";
import Rating from "./Rating.js";

/**
 * Profile component
 * Displays and manages user profile information. Allows users to view and update their profile details, including changing passwords.
 */
export default function Profile() {
  const apiClient = useApiClient();
  // State hooks for user data, mode, password change, and messages
  const [user, setUser] = useState({});
  const [ownerMode, setOwnerMode] = useState(true); // Determines if the profile is being viewed or edited by the owner
  const [changePassword, setChangePassword] = useState(false); // Toggles password change form
  const [message, setMessage] = useState(""); // Holds success or error messages
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePictureURL, setProfilePictureURL] = useState();
  const [resumeFile, setResumeFile] = useState(null);

  let { userId, adminId } = useParams();
  let { state } = useLocation();
  const navigate = useNavigate();
  userId = userId || adminId;
  let profileId = state;
  let currentUser = profileId || userId;

  // Set owner mode based on the profile being viewed
  useEffect(() => {
    if ((profileId && profileId !== userId) || userId === ":userId") {
      setOwnerMode(false);
    } else {
      setOwnerMode(true);
    }
  }, [profileId]);

  // Fetch user profile data when component mounts or userId changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get(
          `/users/${userId}/profile/${currentUser}`,
          {}
        );

        setUser(response);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    fetchUserProfile();
  }, [currentUser]);

  /**
   * Handles changes to input fields for user details.
   * Updates the user state with the new values.
   *
   * @param {Object} e - The input change event.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  /**
   * Handles file input changes for profile picture and resume.
   *
   * @param {Object} e - The file input change event.
   */
  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === "profilePictureFile") {
      setProfilePictureFile(files[0]);
    } else if (name === "resume") {
      setResumeFile(files[0]);
    }
  };

  /**
   * Handles form submission for updating user profile details.
   * Sends a PUT request to update the profile with any new data or files.
   *
   * @param {Object} e - The form submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (profilePictureFile) {
        formData.append("profilePicture", profilePictureFile);
      }
      if (profilePictureURL) {
        user.profilePicture = profilePictureURL;
      }
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }
      formData.append("user", JSON.stringify(user));

      const response = await apiClient.put(
        `/users/profile/${currentUser}`,
        formData
      );

      setMessage("The details have been successfully updated.");
      setUser(response);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  /**
   * Handles password change.
   * Sends a PUT request to update the password if valid.
   */
  const handlePasswordChange = async () => {
    if (currentPassword.trim() === "" || newPassword.trim() === "") return;
    if (newPassword.length < 4) {
      setMessage("Password must be at least 4 characters");
      return;
    }
    try {
      const response = await apiClient.put(
        `/users/${userId}/change-password`,
        {
          userId: currentUser,
          currentPassword,
          newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(response.message);
      setCurrentPassword("");
      setNewPassword("");
      setChangePassword(false);
    } catch (error) {
      setMessage(error.message);
      console.error("Failed to change password:", error);
    }
  };

  const handleReport = async () => {
    try {
      await apiClient.post(`/users/${userId}/report`, {
        currentUser,
      });
    } catch (error) {
      console.error("Error liking comment:", error); // Log error
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action will delete all your services and cannot be undone."
    );

    if (confirmed) {
      try {
        const response = await apiClient.delete(`/users/${userId}/deleteAccount`, {});
        alert("Your account has been successfully deleted.");
        // Optionally, redirect the user after account deletion
        navigate("/");
      } catch (error) {
        alert(
          "An error occurred while deleting your account. Please try again."
        );
        console.error(error);
      }
    }
  };

  return (
    <div className="profilePage">
      <div className="half-circle"></div>
      <div className="profile-container">
        <div className="profile-header">
          <img
            src={
              user.profilePicture
                ? user.profilePicture.startsWith("http")
                  ? user.profilePicture
                  : `http://localhost:5000${user.profilePicture}`
                : "default-profile-picture-url.jpg"
            }
            alt={user.profilePicture}
            id="profile-picture"
          />
        </div>
        <p>Rating: {user.rating} ★</p>
        {user.resume && (
          <div className="resume-link">
            <a
              href={
                user.resume.startsWith("http")
                  ? user.resume
                  : `http://localhost:5000${user.resume}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              View Resume
            </a>
          </div>
        )}
        {ownerMode ? (
          <>
            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="profile-details"
            >
              {/* User information fields */}

              <input
                type="text"
                name="username"
                value={user.username || ""}
                onChange={handleInputChange}
                onClick={() => setMessage("")}
                placeholder="Name"
              />
              <input
                type="text"
                name="phone"
                value={user.phone || ""}
                onChange={handleInputChange}
                onClick={() => setMessage("")}
                placeholder="Phone"
              />
              <textarea
                name="about"
                value={user.about || ""}
                onChange={handleInputChange}
                onClick={() => setMessage("")}
                placeholder="About"
              />
              <label htmlFor="file-upload" className="file-upload-label">
                Upload profile picture
              </label>
              <input
                type="file"
                name="profilePictureFile"
                onChange={handleFileChange}
                onClick={() => setMessage("")}
              />
              <input
                type="text"
                name="profilePicture"
                value={profilePictureURL || ""}
                onClick={() => setMessage("")}
                onChange={(e) => setProfilePictureURL(e.target.value)}
                placeholder="Profile Picture URL"
              />
              <label htmlFor="file-upload" className="file-upload-label">
                Upload Resume
              </label>
              <input
                type="file"
                name="resume"
                onClick={() => setMessage("")}
                onChange={handleFileChange}
                className="file-upload"
              />

              <input
                type="email"
                name="email"
                value={user.email || ""}
                onClick={() => setMessage("")}
                onChange={handleInputChange}
                placeholder="Email"
              />

              {/* Password change toggle and form */}
              {!changePassword ? (
                <button
                  className="profile-button"
                  type="button"
                  onClick={() => {
                    setChangePassword(true);
                  }}
                >
                  Change Password
                </button>
              ) : (
                <>
                  <h2>Change Password</h2>
                  <input
                    type="password"
                    name="currentPassword"
                    value={currentPassword}
                    onClick={() => setMessage("")}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current Password"
                  />
                  <input
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onClick={() => setMessage("")}
                    placeholder="New Password"
                  />
                  <input
                    type="button"
                    className="profile-button"
                    value="Change Password"
                    onClick={handlePasswordChange}
                  />
                </>
              )}

              <p>{message}</p>
              <button className="profile-button" type="submit">
                Update Profile
              </button>
            </form>
            <button
              onClick={handleDeleteAccount}
              className="delete-account-button"
            >
              Delete Account
            </button>
            <br/>
          </>
        ) : (
          <>
            {/* Display user details if not in owner mode */}
            <p>{user.username}</p>
            <p>{user.about}</p>
            <p>{user.email}</p>
            {!ownerMode && userId !== ":userId" && (
              <>
                <Rating profileUserId={user.id} setUser={setUser} />
                <button onClick={handleReport}>report</button>
                <br />
              </>
            )}
          </>
        )}
        <Link to="../categories/All" state={currentUser} id="link-to-service">
          {user.username}'s offers and requests
        </Link>
      </div>
    </div>
  );
}
