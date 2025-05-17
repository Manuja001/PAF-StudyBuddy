import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoBlack from "../assets/logoblack.png";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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
                to="/HomePage"
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
                to="/view-study-plan"
                className={`nav-item ${
                  isActive("/view-study-plan")
                    ? "nav-item-active"
                    : "nav-item-default"
                }`}
              >
                View Study Plan
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
                to="/create-post"
                className={`nav-item ${
                  isActive("/create-post")
                    ? "nav-item-active"
                    : "nav-item-default"
                }`}
              >
                Create Post
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
