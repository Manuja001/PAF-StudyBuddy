import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserProfile from "../assets/userProfile1.png";
import axios from "../config/axios";
import {
  FiEdit2,
  FiMail,
  FiUser,
  FiMessageCircle,
  FiLogOut,
} from "react-icons/fi";
import "./Profile.css";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`, {});
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to load profile data. Please try again.");
      }
    };
    fetchProfile();
  }, [id]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profilePictureUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = () => {
    setIsEditing(false);
    const updateProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(profile),
        });
        if (!response.ok) {
          throw new Error("Failed to update profile data");
        }
        toast.success("Profile updated successfully!");
      } catch (error) {
        console.error("Error updating profile data:", error);
        toast.error("Failed to update profile. Please try again.");
      }
    };
    updateProfile();
  };

  if (!profile) {
    return <div className="profile-loading">Loading...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="loading text-gray-600 text-center py-20">
          Loading profile data...
        </div>
      </div>
    );
  }

  return (
    <div className="profile-root">
      <div className="profile-container">
        <div className="profile-flex">
          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="profile-card">
              {/* Profile Image Section */}
              <div className="profile-image-section">
                <div className="profile-gradient-bg"></div>
                <div className="profile-image-wrapper">
                  <div className="profile-image-inner">
                    <img
                      src={profile.profilePictureUrl || UserProfile}
                      alt="Profile"
                      className="profile-image"
                    />
                    {isEditing && (
                      <label className="profile-edit-label">
                        <FiEdit2 className="profile-edit-icon" />
                        <input
                          type="file"
                          className="profile-edit-input"
                          onChange={handleProfilePictureChange}
                          accept="image/*"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="profile-info">
                <h1 className="profile-name">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="profile-email">{profile.email}</p>

                {/* Stats */}
                <div className="profile-stats">
                  <div className="profile-stat">
                    <p className="profile-stat-value">
                      {profile.followers || 0}
                    </p>
                    <p className="profile-stat-label">Followers</p>
                  </div>
                  <div className="profile-stat">
                    <p className="profile-stat-value">
                      {profile.following || 0}
                    </p>
                    <p className="profile-stat-label">Following</p>
                  </div>
                </div>

                {/* Profile Details */}
                {isEditing ? (
                  <div className="profile-edit-section">
                    <div className="profile-edit-fields">
                      <div>
                        <label className="profile-label">First Name</label>
                        <input
                          type="text"
                          className="profile-input"
                          value={profile.firstName}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              firstName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="profile-label">Last Name</label>
                        <input
                          type="text"
                          className="profile-input"
                          value={profile.lastName}
                          onChange={(e) =>
                            setProfile({ ...profile, lastName: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="profile-label">Email</label>
                        <input
                          type="email"
                          className="profile-input"
                          value={profile.email}
                          onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="profile-label">Bio</label>
                        <textarea
                          className="profile-input"
                          rows="4"
                          value={profile.bio}
                          onChange={(e) =>
                            setProfile({ ...profile, bio: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="profile-bio-section">
                    <p className="profile-bio">{profile.bio}</p>
                    <div className="profile-details">
                      <div className="profile-detail-row">
                        <FiUser className="profile-detail-icon" />
                        <div>
                          <p className="profile-detail-label">Full Name</p>
                          <p className="profile-detail-value">
                            {profile.firstName} {profile.lastName}
                          </p>
                        </div>
                      </div>
                      <div className="profile-detail-row">
                        <FiMail className="profile-detail-icon" />
                        <div>
                          <p className="profile-detail-label">Email</p>
                          <p className="profile-detail-value">
                            {profile.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="profile-actions">
                  <button
                    onClick={
                      isEditing ? handleProfileUpdate : () => setIsEditing(true)
                    }
                    className="profile-action-btn profile-action-edit"
                  >
                    <FiEdit2 className="profile-action-icon" />
                    {isEditing ? "Save Profile" : "Edit Profile"}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="profile-action-btn profile-action-logout"
                  >
                    <FiLogOut className="profile-action-icon" />
                    Log out
                  </button>
                  <button
                    onClick={() => (window.location.href = "/chatBot")}
                    className="profile-action-btn profile-action-chatbot"
                  >
                    <FiMessageCircle className="profile-action-icon" />
                    Chat Bot
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="profile-main-content">
            <div className="profile-main-sections">
              {/* Posts Section */}
              <div className="profile-section">
                <div className="profile-section-header">
                  <div className="profile-section-title-row">
                    <div className="profile-section-title-bar"></div>
                    <h2 className="profile-section-title">My Posts</h2>
                  </div>
                  <button
                    onClick={() => navigate("/create-post")}
                    className="profile-section-btn profile-section-btn-create"
                  >
                    Create New Post
                  </button>
                </div>

                <div className="profile-section-list">
                  <div className="profile-section-list-item">
                    <h3 className="profile-section-list-title">
                      How to build a React App
                    </h3>
                    <p className="profile-section-list-date">
                      Posted on Jan 15, 2024
                    </p>
                    <p className="profile-section-list-desc">
                      In this post, I walk through the process of setting up a
                      React app from scratch.
                    </p>
                  </div>
                  <div className="profile-section-list-item">
                    <h3 className="profile-section-list-title">
                      Mastering Spring Boot
                    </h3>
                    <p className="profile-section-list-date">
                      Posted on Jan 12, 2024
                    </p>
                    <p className="profile-section-list-desc">
                      Spring Boot simplifies Java development. Here you can find
                      everything you need to know to get started.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/posts")}
                  className="profile-section-btn profile-section-btn-view"
                >
                  View All Posts
                </button>
              </div>

              {/* Study Plans Section */}
              <div className="profile-section">
                <div className="profile-section-header">
                  <div className="profile-section-title-row">
                    <div className="profile-section-title-bar"></div>
                    <h2 className="profile-section-title">My Study Plans</h2>
                  </div>
                  <button
                    onClick={() => navigate("/study-plan")}
                    className="profile-section-btn profile-section-btn-create"
                  >
                    Create Study Plan
                  </button>
                </div>

                <div className="profile-section-list">
                  <div className="profile-section-list-item">
                    <h3 className="profile-section-list-title">
                      Final Exam Preparation
                    </h3>
                    <p className="profile-section-list-date">
                      Created on Jan 20, 2024
                    </p>
                    <p className="profile-section-list-desc">
                      Comprehensive study plan for final examinations covering
                      all major topics.
                    </p>
                  </div>
                  <div className="profile-section-list-item">
                    <h3 className="profile-section-list-title">
                      Weekly Study Schedule
                    </h3>
                    <p className="profile-section-list-date">
                      Created on Jan 18, 2024
                    </p>
                    <p className="profile-section-list-desc">
                      Regular weekly study schedule with daily topic breakdown
                      and goals.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/view-study-plan")}
                  className="profile-section-btn profile-section-btn-view"
                >
                  View All Study Plans
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
