import React, { useEffect, useState } from "react";
import axios from "../config/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import user from "../assets/user.png";
import email from "../assets/email.png";
import role from "../assets/role.png";
import { FaUsers, FaUserCheck, FaUserSlash } from "react-icons/fa";
import "./Admin.css";

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
    <div className="admin-bg">
      <ToastContainer />
      <h1 className="admin-title">Admin Dashboard</h1>
      <div className="admin-summary-cards">
        <div className="admin-summary-card admin-summary-total">
          <FaUsers className="admin-summary-icon" />
          <h2 className="admin-summary-label">Total Users</h2>
          <p className="admin-summary-value">{totalUsers}</p>
        </div>
        <div className="admin-summary-card admin-summary-active">
          <FaUserCheck className="admin-summary-icon" />
          <h2 className="admin-summary-label">Active Users</h2>
          <p className="admin-summary-value">{totalActiveUsers}</p>
        </div>
        <div className="admin-summary-card admin-summary-inactive">
          <FaUserSlash className="admin-summary-icon" />
          <h2 className="admin-summary-label">Inactive Users</h2>
          <p className="admin-summary-value">{totalInactiveUsers}</p>
        </div>
      </div>
      <div className="admin-form-box">
        <h2 className="admin-form-title">
          {editingUser ? "Edit User" : "Add User"}
        </h2>
        <form onSubmit={handleSubmit} className="admin-form">
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
            <div key={id} className="admin-input-group">
              <img src={icon} alt={id} className="admin-input-icon" />
              <input
                className="admin-input-field"
                type={type}
                id={id}
                placeholder={placeholder}
                value={form[id]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <div className="admin-input-group">
            <img src={role} alt="role" className="admin-input-icon" />
            <select
              id="role"
              value={form.role}
              onChange={handleChange}
              className="admin-input-field"
              required
            >
              <option value="">- Select Role -</option>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="admin-form-actions">
            <button
              type="submit"
              disabled={loading}
              className="admin-btn admin-btn-submit"
            >
              {loading ? "Saving..." : editingUser ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="admin-btn admin-btn-clear"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
      <div className="admin-list-box">
        <h2 className="admin-list-title">User List</h2>
        <div className="admin-list-header">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="admin-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={generateCSVReport}
            className="admin-btn admin-btn-report"
          >
            Generate CSV Report
          </button>
        </div>
        {fetching ? (
          <div className="admin-loading">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="admin-empty">No users found</div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, idx) => (
                  <tr key={user.id}>
                    <td>{idx + 1}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>
                      <a
                        href={`mailto:${user.email}`}
                        className="admin-email-link"
                      >
                        {user.email}
                      </a>
                    </td>
                    <td>
                      <span
                        className={`admin-role-badge ${
                          user.role?.toLowerCase() === "admin"
                            ? "admin-role-admin"
                            : "admin-role-user"
                        }`}
                      >
                        {user.role || "N/A"}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleUserStatus(user.id, user.enabled)}
                        className={`admin-status-btn ${
                          user.enabled
                            ? "admin-status-active"
                            : "admin-status-inactive"
                        }`}
                        disabled={loading}
                      >
                        {user.enabled ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td>
                      <div className="admin-action-btns">
                        <button
                          onClick={() => handleEdit(user)}
                          className="admin-btn admin-btn-edit"
                          aria-label={`Edit user ${user.firstName} ${user.lastName}`}
                        >
                          <svg
                            className="admin-icon"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="admin-btn admin-btn-delete"
                          aria-label={`Delete user ${user.firstName} ${user.lastName}`}
                        >
                          <svg
                            className="admin-icon"
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
