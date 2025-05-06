import React, { useEffect, useState } from "react";
import axios from "../config/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import user from "../assets/user.png";
import email from "../assets/email.png";
import role from "../assets/role.png";
import { FaUsers, FaUserCheck, FaUserSlash } from "react-icons/fa";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setFetching(true);
    try {
      const res = await axios.get("/api/users");
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to fetch users: " + err.message);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingUser) {
        await axios.put(`/api/users/${editingUser.id}`, form);
        toast.success("User updated!");
      } else {
        await axios.post("/api/users", form);
        toast.success("User added!");
      }
      fetchUsers();
      resetForm();
    } catch (err) {
      toast.error("Error saving user: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setLoading(true);
      try {
        await axios.delete(`/api/users/${id}`);
        toast.success("User deleted.");
        fetchUsers();
      } catch (err) {
        toast.error("Error deleting user: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setForm({ firstName: "", lastName: "", email: "", role: "" });
    setEditingUser(null);
  };

  const handleEdit = (user) => {
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
    setEditingUser(user);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    setLoading(true);
    console.log(currentStatus);
    try {
      await axios.patch(`/api/users/${userId}`, {
        enabled: !currentStatus,
      });

      toast.success(`User ${!currentStatus ? "Activated" : "Deactivated"}!`);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, enabled: !currentStatus } : user
        )
      );
    } catch (err) {
      toast.error("Failed to update user status: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateCSVReport = () => {
    try {
      const headers = [
        "ID",
        "First Name",
        "Last Name",
        "Email",
        "Role",
        "Status",
      ];
      const rows = users.map((user) => [
        user.id,
        user.firstName,
        user.lastName,
        user.email,
        user.role || "N/A",
        user.enabled ? "Active" : "Inactive",
      ]);
      const csvContent = [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("CSV report generated successfully!");
    } catch (error) {
      toast.error("Failed to generate CSV report: " + error.message);
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName} ${user.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalUsers = users.length;
  const totalActiveUsers = users.filter((user) => user.enabled).length;
  const totalInactiveUsers = totalUsers - totalActiveUsers;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <h1 className="text-4xl font-extrabold text-center mb-10 text-blue-800">
        Admin Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 max-w-7xl mx-auto">
        {/* Total Users */}
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-xl rounded-2xl p-6 flex flex-col items-center w-90">
          <FaUsers className="text-5xl mb-3" />
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-4xl font-bold mt-1">{totalUsers}</p>
        </div>

        {/* Active Users */}
        <div className="bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-xl rounded-2xl p-6 flex flex-col items-center w-90">
          <FaUserCheck className="text-5xl mb-3" />
          <h2 className="text-xl font-semibold">Active Users</h2>
          <p className="text-4xl font-bold mt-1">{totalActiveUsers}</p>
        </div>

        {/* Inactive Users */}
        <div className="bg-gradient-to-br from-red-400 to-rose-600 text-white shadow-xl rounded-2xl p-6 flex flex-col items-center w-90">
          <FaUserSlash className="text-5xl mb-3" />
          <h2 className="text-xl font-semibold">Inactive Users</h2>
          <p className="text-4xl font-bold mt-1">{totalInactiveUsers}</p>
        </div>
      </div>

      {/* User Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto mb-12 font-sans">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          {editingUser ? "Edit User" : "Add User"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            {
              id: "firstName",
              type: "text",
              placeholder: "Enter First Name",
              icon: user,
            },
            {
              id: "lastName",
              type: "text",
              placeholder: "Enter Last Name",
              icon: user,
            },
            {
              id: "email",
              type: "email",
              placeholder: "Enter Email Address",
              icon: email,
            },
          ].map(({ id, type, placeholder, icon }) => (
            <div
              key={id}
              className="flex items-center border border-slate-300 rounded-xl px-4 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-400"
            >
              <img src={icon} alt={id} className="w-5 h-5 mr-3 opacity-70" />
              <input
                className="w-full bg-transparent focus:outline-none text-sm"
                type={type}
                id={id}
                placeholder={placeholder}
                value={form[id]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          {/* Role Select */}
          <div className="flex items-center border border-slate-300 rounded-xl px-4 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-400">
            <img src={role} alt="role" className="w-5 h-5 mr-3 opacity-70" />
            <select
              id="role"
              value={form.role}
              onChange={handleChange}
              className="w-full bg-transparent text-sm focus:outline-none"
              required
            >
              <option value="">- Select Role -</option>
              <option className="bg-green-200" value="User">
                User
              </option>
              <option className="bg-blue-200" value="Admin">
                Admin
              </option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2.5 rounded-xl text-white font-semibold transition duration-200 ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Saving..." : editingUser ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 rounded-xl bg-gray-300 hover:bg-gray-400 transition duration-200"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* User List */}
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-7xl mx-auto font-sans">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 relative pb-2">
          User List
          <span className="absolute bottom-0 left-0 w-14 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"></span>
        </h2>
        <div className="flex justify-between items-center mb-6">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search by name or email..."
            className="border border-gray-300 rounded-xl px-4 py-2 w-full max-w-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Report button */}
          <button
            onClick={generateCSVReport}
            className="ml-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-xl shadow-md hover:from-indigo-600 hover:to-purple-700 transition-colors"
          >
            Generate CSV Report
          </button>
        </div>

        {fetching ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-400 rounded-full animate-spin mb-4"></div>
            <p>Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <p>No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <th className="px-6 py-3 text-left rounded-tl-lg">#</th>
                  <th className="px-6 py-3 text-left">First Name</th>
                  <th className="px-6 py-3 text-left">Last Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Role</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, idx) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.firstName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={`mailto:${user.email}`}
                        className="text-blue-500 hover:text-blue-600 hover:underline transition-colors"
                      >
                        {user.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role?.toLowerCase() === "admin"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleUserStatus(user.id, user.enabled)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.enabled
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                        disabled={loading}
                      >
                        {user.enabled ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                          aria-label={`Edit user ${user.firstName} ${user.lastName}`}
                        >
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          aria-label={`Delete user ${user.firstName} ${user.lastName}`}
                        >
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a 2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
