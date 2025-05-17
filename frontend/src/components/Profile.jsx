import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import UserProfile from "../assets/userProfile1.png";
import EditIcon from "../assets/pen.png";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

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

  return (
    <div className="profile-bg">
      <div className="profile-container">
        <div className="profile-header">
          <img
            src={profile.profilePictureUrl || UserProfile}
            alt="Profile"
            className="profile-avatar"
          />
          <h1 className="profile-name">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="profile-email">{profile.email}</p>
        </div>

        <div className="profile-details-box">
          <h2 className="profile-details-title">Profile Details</h2>
          <div className="profile-details-content">
            {isEditing ? (
              <div>
                <div className="profile-edit-field">
                  <input
                    type="file"
                    className="profile-input"
                    onChange={handleProfilePictureChange}
                  />
                </div>
                <div className="profile-edit-field">
                  <input
                    type="text"
                    className="profile-input"
                    value={profile.firstName}
                    onChange={(e) =>
                      setProfile({ ...profile, firstName: e.target.value })
                    }
                    placeholder="Enter your First Name"
                  />
                </div>
                <div className="profile-edit-field">
                  <input
                    type="text"
                    className="profile-input"
                    value={profile.lastName}
                    onChange={(e) =>
                      setProfile({ ...profile, lastName: e.target.value })
                    }
                    placeholder="Enter your Last Name"
                  />
                </div>
                <div className="profile-edit-field">
                  <input
                    type="text"
                    className="profile-input"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    placeholder="Change your Email address"
                  />
                </div>
                <div className="profile-edit-field">
                  <textarea
                    className="profile-input"
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    placeholder="Enter your bio"
                  />
                </div>
                <div className="profile-edit-actions">
                  <button
                    onClick={handleProfileUpdate}
                    className="profile-btn profile-btn-save"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      fetch(`http://localhost:8080/api/users/${id}`, {
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
                        },
                      })
                        .then((res) => res.json())
                        .then((data) => setProfile(data));
                    }}
                    className="profile-btn profile-btn-discard"
                  >
                    Discard
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="profile-bio">{profile.bio}</p>
                <div className="profile-edit-btn-wrapper">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="profile-btn profile-btn-edit"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="profile-stats-grid">
          <div className="profile-stat profile-stat-followers">
            <p className="profile-stat-value">{profile.followers}</p>
            <p className="profile-stat-label">Followers</p>
          </div>
          <div className="profile-stat profile-stat-following">
            <p className="profile-stat-value">{profile.following}</p>
            <p className="profile-stat-label">Following</p>
          </div>
        </div>

        {/* Follow Button */}
        <div className="profile-chatbot-btn-wrapper">
          <button
            className="profile-btn profile-btn-chatbot"
            onClick={() => {
              window.location.href = "/chatBot";
            }}
          >
            Chat Bot
          </button>
        </div>

        {/* Profile Details Section */}
        <div className="profile-info-list">
          <div className="profile-info-row profile-info-row-email">
            <span className="profile-info-label">Email:</span>
            <span className="profile-info-value">{profile.email}</span>
            <img src={EditIcon} alt="Edit" className="profile-info-edit-icon" />
          </div>
          <div className="profile-info-row profile-info-row-status">
            <span className="profile-info-label">Profile Status:</span>
            <span className="profile-info-status">Active</span>
          </div>
        </div>

        {/* Post Section */}
        <div className="profile-posts-box">
          <h2 className="profile-posts-title">My Posts</h2>
          <div className="profile-posts-list">
            <div className="profile-post">
              <h3 className="profile-post-title">How to build a React App</h3>
              <p className="profile-post-date">Posted on Jan 15, 2024</p>
              <p className="profile-post-content">
                In this post, I walk through the process of setting up a React
                app from scratch.
              </p>
            </div>
            <div className="profile-post">
              <h3 className="profile-post-title">Mastering Spring Boot</h3>
              <p className="profile-post-date">Posted on Jan 12, 2024</p>
              <p className="profile-post-content">
                Spring Boot simplifies Java development. Here you can find
                everything you need to know to get started.
              </p>
            </div>
            <div className="profile-posts-actions">
              <button
                className="profile-btn profile-btn-view"
                onClick={() => {
                  navigate("/posts");
                }}
              >
                View All Posts
              </button>

              <button
                className="profile-btn profile-btn-create"
                onClick={() => {
                  navigate("/create-post");
                }}
              >
                Create New Post
              </button>
              <button
                className="profile-btn profile-btn-logout"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
