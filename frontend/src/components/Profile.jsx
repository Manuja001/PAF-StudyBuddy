import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserProfile from "../assets/userProfile1.png";
import EditIcon from "../assets/pen.png";
import axios from "../config/axios";
import { FiEdit2, FiMail, FiUser, FiBook, FiMessageCircle, FiLogOut } from "react-icons/fi";

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="loading text-gray-600 text-center py-20">Loading profile data...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#f8f9fa] pt-20 pb-8">
      <div className="w-[90%] h-[calc(100vh-48px)] max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 h-full">
          {/* Sidebar */}
          <div className="w-full lg:w-[380px] flex-shrink-0">
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-100 sticky top-6">
              {/* Profile Image Section */}
              <div className="relative">
                <div className="h-24 bg-gradient-to-r from-[#fb5e2e] to-[#ff7346]"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                  <div className="relative">
                    <img
                      src={profile.profilePictureUrl || UserProfile}
                      alt="Profile"
                      className="w-20 h-20 rounded-full border-4 border-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] object-cover"
                    />
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-white rounded-md p-2 shadow-[0_2px_4px_rgba(0,0,0,0.08)] cursor-pointer hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-shadow">
                        <FiEdit2 className="w-4 h-4 text-[#fb5e2e]" />
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleProfilePictureChange}
                          accept="image/*"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="pt-12 pb-5 px-6">
                <h1 className="text-xl font-bold text-center text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-gray-500 text-sm text-center mt-1">{profile.email}</p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 rounded-lg bg-orange-50">
                    <p className="text-xl font-bold text-[#fb5e2e]">{profile.followers || 0}</p>
                    <p className="text-xs text-gray-600">Followers</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-orange-50">
                    <p className="text-xl font-bold text-[#fb5e2e]">{profile.following || 0}</p>
                    <p className="text-xs text-gray-600">Following</p>
                  </div>
                </div>

                {/* Profile Details */}
                {isEditing ? (
                  <div className="mt-6 space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#fb5e2e] focus:ring-1 focus:ring-[#fb5e2e] outline-none"
                          value={profile.firstName}
                          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#fb5e2e] focus:ring-1 focus:ring-[#fb5e2e] outline-none"
                          value={profile.lastName}
                          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#fb5e2e] focus:ring-1 focus:ring-[#fb5e2e] outline-none"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                        <textarea
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#fb5e2e] focus:ring-1 focus:ring-[#fb5e2e] outline-none"
                          rows="4"
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    <p className="text-gray-600 leading-relaxed text-center">{profile.bio}</p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                        <FiUser className="w-5 h-5 text-[#fb5e2e]" />
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium text-gray-900">{profile.firstName} {profile.lastName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                        <FiMail className="w-5 h-5 text-[#fb5e2e]" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium text-gray-900">{profile.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#fb5e2e] text-white hover:bg-[#ff7346] transition-all shadow-[0_2px_4px_rgba(251,94,46,0.2)] hover:shadow-[0_2px_8px_rgba(251,94,46,0.3)]"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    {isEditing ? "Save Profile" : "Edit Profile"}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Log out
                  </button>
                  <button
                    onClick={() => window.location.href = "/chatBot"}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    <FiMessageCircle className="w-4 h-4" />
                    Chat Bot
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-6">
              {/* Posts Section */}
              <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-[#fb5e2e] rounded-full"></div>
                    <h2 className="text-lg font-bold text-gray-900">My Posts</h2>
                  </div>
                  <button 
                    onClick={() => navigate('/create-post')}
                    className="px-3 py-1.5 bg-[#fb5e2e] text-white text-sm rounded-lg hover:bg-[#ff7346] transition-all shadow-[0_2px_4px_rgba(251,94,46,0.2)] hover:shadow-[0_2px_8px_rgba(251,94,46,0.3)]"
                  >
                    Create New Post
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg border border-gray-100 hover:border-[#fb5e2e] transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                    <h3 className="font-medium text-gray-900 text-sm">How to build a React App</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Posted on Jan 15, 2024</p>
                    <p className="text-gray-600 mt-1 text-xs line-clamp-1">
                      In this post, I walk through the process of setting up a React app from scratch.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg border border-gray-100 hover:border-[#fb5e2e] transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                    <h3 className="font-medium text-gray-900 text-sm">Mastering Spring Boot</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Posted on Jan 12, 2024</p>
                    <p className="text-gray-600 mt-1 text-xs line-clamp-1">
                      Spring Boot simplifies Java development. Here you can find everything you need to know to get started.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/posts')}
                  className="w-full mt-3 px-4 py-1.5 text-[#fb5e2e] text-sm bg-orange-50 rounded-lg hover:bg-orange-100 transition-all font-medium"
                >
                  View All Posts
                </button>
              </div>

              {/* Study Plans Section */}
              <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-[#fb5e2e] rounded-full"></div>
                    <h2 className="text-lg font-bold text-gray-900">My Study Plans</h2>
                  </div>
                  <button 
                    onClick={() => navigate('/study-plan')}
                    className="px-3 py-1.5 bg-[#fb5e2e] text-white text-sm rounded-lg hover:bg-[#ff7346] transition-all shadow-[0_2px_4px_rgba(251,94,46,0.2)] hover:shadow-[0_2px_8px_rgba(251,94,46,0.3)]"
                  >
                    Create Study Plan
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg border border-gray-100 hover:border-[#fb5e2e] transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                    <h3 className="font-medium text-gray-900 text-sm">Final Exam Preparation</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Created on Jan 20, 2024</p>
                    <p className="text-gray-600 mt-1 text-xs line-clamp-1">
                      Comprehensive study plan for final examinations covering all major topics.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg border border-gray-100 hover:border-[#fb5e2e] transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                    <h3 className="font-medium text-gray-900 text-sm">Weekly Study Schedule</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Created on Jan 18, 2024</p>
                    <p className="text-gray-600 mt-1 text-xs line-clamp-1">
                      Regular weekly study schedule with daily topic breakdown and goals.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/view-study-plan')}
                  className="w-full mt-3 px-4 py-1.5 text-[#fb5e2e] text-sm bg-orange-50 rounded-lg hover:bg-orange-100 transition-all font-medium"
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
