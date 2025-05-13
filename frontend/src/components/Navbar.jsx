import React, { useState } from "react";
import logoBlack from "../assets/logoblack.png";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="logo-container">
          <img src={logoBlack} className="logo" alt="StudyBuddy Logo" />
        </a>
        
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          type="button"
          className="menu-button"
        >
          <span className="sr-only">Open main menu</span>
          <svg className="menu-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>

        <div className={`nav-menu ${!isMenuOpen && 'hidden md:block'}`}>
          <ul className="nav-list">
            <li>
              <a href="#" className={`nav-item nav-item-active`}>Home</a>
            </li>
            <li>
              <a href="#" className={`nav-item nav-item-default`}>Features</a>
            </li>
            <li>
              <a href="#" className={`nav-item nav-item-default`}>About</a>
            </li>
            <li>
              <a href="#" className={`nav-item nav-item-default`}>Contact</a>
            </li>
            <li>
              <a href="#" className="nav-button">Sign Up</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 