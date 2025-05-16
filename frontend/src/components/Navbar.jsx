import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoBlack from "../assets/logoblack.png";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

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
              <Link to="/#features" className="nav-item nav-item-default">
                Features
              </Link>
            </li>
            <li>
              <Link to="/#about" className="nav-item nav-item-default">
                About
              </Link>
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
              <Link to="/#contact" className="nav-item nav-item-default">
                Contact
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
