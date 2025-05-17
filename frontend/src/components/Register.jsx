import React, { useState } from "react";
import { Link } from "react-router-dom";
import background from "../assets/Reg.jpeg";
import user from "../assets/user.png";
import email from "../assets/email.png";
import password from "../assets/password.png";
import showPasswordIcon from "../assets/showPassword.png";
import hidePasswordIcon from "../assets/hidePassword.png";
import { toast } from "react-toastify";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const dataToSubmit = {
      ...formData,
      role: "User",
      bio:
        "Hi I am " +
        (formData.firstName || "") +
        " " +
        (formData.lastName || ""),
    };
    setLoading(true);
    try {
      const response = await axios.post("/api/register", dataToSubmit);
      if (response.status === 200) {
        toast.success("Registration successful!");
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.message || "Registration failed.";
        if (errorMessage.includes("User already exists")) {
          toast.error("Email already exists. Please use a different email.");
        }
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-box">
          <div>
            <h1>
              <span className="welcome-text">Welcome </span>
              <span className="back-text">!</span>
            </h1>
            <p className="sub-text">Enter your details below!</p>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <div className="input-group">
              <label htmlFor="firstName" className="input-label">
                First Name
              </label>
              <div className="input-wrapper">
                <img src={user} alt="user" className="input-icon" />
                <input
                  className="input-field"
                  type="text"
                  id="firstName"
                  placeholder="Enter your First Name"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="lastName" className="input-label">
                Last Name
              </label>
              <div className="input-wrapper">
                <img src={user} alt="user" className="input-icon" />
                <input
                  className="input-field"
                  type="text"
                  id="lastName"
                  placeholder="Enter your Last Name"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="email" className="input-label">
                Email
              </label>
              <div className="input-wrapper">
                <img src={email} alt="email" className="input-icon" />
                <input
                  className="input-field"
                  type="email"
                  id="email"
                  placeholder="Enter your Email"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <div className="input-wrapper">
                <img src={password} alt="password" className="input-icon" />
                <div className="password-wrapper">
                  <input
                    className="input-field password-input"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-password"
                  >
                    <img
                      src={showPassword ? hidePasswordIcon : showPasswordIcon}
                      alt="toggle password visibility"
                      className="toggle-icon"
                    />
                  </button>
                </div>
              </div>
            </div>

            <input
              type="hidden"
              id="role"
              value="User"
              onChange={handleChange}
            />

            <p className="register-text">
              Already have an account?{" "}
              <Link to="/login" className="register-link">
                Login
              </Link>
            </p>

            <div className="button-wrapper">
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? "Loading..." : "Register"}
              </button>
            </div>

            <div className="button-wrapper">
              <button
                type="button"
                onClick={() =>
                  (window.location.href =
                    "http://localhost:8080/oauth2/authorization/google")
                }
                className="google-button"
              >
                Continue with Google
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="image-container">
        <img src={background} alt="background" className="background-img" />
      </div>
    </div>
  );
};

export default Register;
