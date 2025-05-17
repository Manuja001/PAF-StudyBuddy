import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoBlack from "../assets/logoblack.png";
import "./Navbar.css";
import { FiUser } from "react-icons/fi";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userId, setUserId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated by looking for token in localStorage
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    setIsAuthenticated(!!token);
    if (storedUserId) {
      setUserId(storedUserId);
    } else if (token) {
      // If we have a token but no userId, redirect to login
      handleLogout();
    }
  }, [location]); // Re-check when location changes

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    setUserId(null);
    setShowLogin(false);
    navigate("/login");
  };

  const handleAuthButtonClick = () => {
    if (!showLogin) {
      setShowLogin(true);
      navigate("/register");
    } else {
      navigate("/login");
    }
  };

  const isActive = (path) => location.pathname === path;

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      // If not on home page, navigate to home and then scroll
      window.location.href = `/#${sectionId}`;
    } else {
      scrollToSection(sectionId);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo-container">
          <img src={logoBlack} className="logo" alt="StudyBuddy Logo" />
        </Link>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          type="button"
          className="menu-button"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="menu-icon"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        <div className={`nav-menu ${!isMenuOpen && "hidden md:block"}`}>
          <ul className="nav-list">
            <li>
              <Link
                to="/"
                className={`nav-item ${
                  isActive("/") ? "nav-item-active" : "nav-item-default"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <a
                href="#features"
                onClick={(e) => handleNavClick(e, "features")}
                className="nav-item nav-item-default"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#about"
                onClick={(e) => handleNavClick(e, "about")}
                className="nav-item nav-item-default"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "contact")}
                className="nav-item nav-item-default"
              >
                Contact
              </a>
            </li>
            <li>
              <Link
                to="/study-plan"
                className={`nav-item ${
                  isActive("/study-plan")
                    ? "nav-item-active"
                    : "nav-item-default"
                }`}
              >
                Create Study Plan
              </Link>
            </li>
            <li>
              <Link
                to="/posts"
                className={`nav-item ${
                  isActive("/posts") ? "nav-item-active" : "nav-item-default"
                }`}
              >
                Posts
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className={`nav-item ${
                  isActive("/login") ? "nav-item-active" : "nav-item-default"
                }`}
              >
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="nav-button">
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
