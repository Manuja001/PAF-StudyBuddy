import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import UserProfile from "../assets/userProfile1.png";
import EditIcon from "../assets/pen.png";

function Profile() {
  const { id } = useParams();
  const [followed, setFollowed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Fetch user profile data from API
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(id);
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to load profile data. Please try again.");
      }
    };
    fetchProfile();
  }, [id]);
  console.log(id);

  // Function to handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profilePictureUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to handle profile update
  const handleProfileUpdate = () => {
    setIsEditing(false);
    //send updated profile data to the server

    const updateProfile = async () => {
      try {
        console.log(profile);
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
    console.log(profile);
    updateProfile();
  };

  // Function to handle follow/unfollow
  const toggleFollow = () => {
    setFollowed(!followed);
  };

  if (!profile) {
    // Show a loading state until the profile data is fetched
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen py-10">
      <div className="container mx-auto bg-white rounded-2xl shadow-xl p-10 w-[90%] max-w-3xl">
        <div className="text-center mb-6 ">
          <img
            src={profile.profilePictureUrl || UserProfile}
            alt="Profile"
            className="rounded-full mx-auto w-32 h-32 border-4 p-2 shadow-md  border-amber-600"
          />
          <h1 className="text-3xl font-extrabold mt-4">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-gray-600 text-sm">{profile.email}</p>
        </div>

        <div className="bg-sky-100 p-5 rounded-xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-2 text-sky-900">
            Profile Details
          </h2>
          <div className="space-y-4">
            {isEditing ? (
              <div>
                <div className="mb-4">
                  <input
                    type="file"
                    className="border p-2 rounded-md w-full"
                    onChange={handleProfilePictureChange}
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    className="border p-2 rounded-md w-full"
                    value={profile.firstName}
                    onChange={(e) =>
                      setProfile({ ...profile, firstName: e.target.value })
                    }
                    placeholder="Enter your First Name"
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    className="border p-2 rounded-md w-full"
                    value={profile.lastName}
                    onChange={(e) =>
                      setProfile({ ...profile, lastName: e.target.value })
                    }
                    placeholder="Enter your Last Name"
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    className="border p-2 rounded-md w-full"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    placeholder="Change your Email address"
                  />
                </div>
                <div className="mb-4">
                  <textarea
                    className="border p-2 rounded-md w-full"
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    placeholder="Enter your bio"
                  />
                </div>
                <div className="text-center flex place-content-evenly">
                  <button
                    onClick={handleProfileUpdate}
                    className="bg-green-500 text-white px-6 py-2 rounded-full hover:scale-105 transition"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      // Re-fetch original profile data if discard is clicked
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
                    className="bg-red-500 text-white px-6 py-2 rounded-full hover:scale-105 transition"
                  >
                    Discard
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p>{profile.bio}</p>
                <div className="text-center mt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500 text-white px-6 py-2 rounded-full hover:scale-105 transition"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 text-center mb-6">
          <div className="bg-green-100 p-4 rounded-xl shadow hover:scale-105 transition">
            <p className="text-2xl font-bold text-green-600">120</p>
            <p className="text-sm font-medium text-gray-700">Followers</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-xl shadow hover:scale-105 transition">
            <p className="text-2xl font-bold text-yellow-600">89</p>
            <p className="text-sm font-medium text-gray-700">Following</p>
          </div>
        </div>

        {/* Follow Button */}
        <div className="text-center mb-6">
          <button
            onClick={toggleFollow}
            className={`${
              followed ? "bg-gray-300" : "bg-blue-500"
            } text-white px-6 py-2 rounded-full hover:scale-105 transition`}
          >
            {followed ? "Unfollow" : "Follow"}
          </button>
        </div>

        {/* Profile Details Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-indigo-100 p-4 rounded-xl shadow">
            <span className="font-semibold text-indigo-900">Email:</span>
            <span className="text-indigo-700">{profile.email}</span>
            <img src={EditIcon} alt="Edit" className="w-5 h-5 cursor-pointer" />
          </div>

          <div className="flex justify-between items-center bg-pink-100 p-4 rounded-xl shadow">
            <span className="font-semibold text-pink-900">Profile Status:</span>
            <span className="text-green-600 font-bold">Active</span>
          </div>
        </div>

        {/* Post Section */}

        <div className="bg-purple-100 p-5 rounded-xl shadow mb-6 mt-8">
          <h2 className="text-xl font-semibold mb-2 text-purple-900">
            My Posts
          </h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="text-lg font-bold">How to build a React App</h3>
              <p className="text-gray-600 text-sm">Posted on Jan 15, 2024</p>
              <p className="text-gray-700 mt-2">
                In this post, I walk through the process of setting up a React
                app from scratch.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="text-lg font-bold">Mastering Spring Boot</h3>
              <p className="text-gray-600 text-sm">Posted on Jan 12, 2024</p>
              <p className="text-gray-700 mt-2">
                Spring Boot simplifies Java development. Here you can find
                everything you need to know to get started.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
