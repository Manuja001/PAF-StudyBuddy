import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import background from "../assets/Login.jpeg";
import email from "../assets/email.png";
import password from "../assets/password.png";
import showPasswordIcon from "../assets/showPassword.png";
import hidePasswordIcon from "../assets/hidePassword.png";
import { toast } from "react-toastify";
import axios from "../config/axios";
import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchOAuthToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      if (code) {
        try {
          const response = await axios.post("/oauth2/callback/google", {
            code,
          });
          if (response.status === 200) {
            const token = response.data.token;
            const userId = response.data.id;
            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            toast.success("Login successful!");
            navigate(`/Profile/${userId}`);
          }
        } catch (error) {
          toast.error("Login failed. Please try again.");
        }
      }
    };
    fetchOAuthToken();
  }, [navigate]);

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
    setLoading(true);
    try {
      const response = await axios.post("/api/login", formData);
      if (response.status === 200) {
        const token = response.data.token;
        const userId = response.data.id;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        toast.success("Login successful!");
        navigate(`/profile/${userId}`);
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="image-container">
        <img src={background} alt="background" className="background-img" />
      </div>
      <div className="form-container">
        <div className="form-box">
          <div>
            <h1>
              <span className="welcome-text">Welcome </span>
              <span className="back-text">Back!</span>
            </h1>
            <p className="sub-text">Enter your details below!</p>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <div className="input-group">
              <label htmlFor="email" className="input-label">
                Email
              </label>
              <div className="input-wrapper">
                <img src={email} alt="email" className="input-icon" />
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your Email"
                  onChange={handleChange}
                  required
                  className="input-field"
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
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    onChange={handleChange}
                    required
                    className="input-field password-input"
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

            <p className="register-text">
              Do not have an account?{" "}
              <Link to="/register" className="register-link">
                Register
              </Link>
            </p>

            <div className="button-wrapper">
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? "Loading..." : "Login"}
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
    </div>
  );
}

export default Login;
