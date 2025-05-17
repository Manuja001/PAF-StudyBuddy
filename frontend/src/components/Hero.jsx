import React, { useState, useEffect } from "react";
import heroImage from "../assets/heroplain.png";
import artlogo from "../assets/artlogo.png";
import "./Hero.css";

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate mouse position as percentage of window size
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const calculateTransform = () => {
    // Subtle movement: maximum 20px in any direction
    const moveX = (mousePosition.x - 50) * 0.2;
    const moveY = (mousePosition.y - 50) * 0.2;
    return `translate(${moveX}px, ${moveY}px)`;
  };

  return (
    <div 
      className="hero-section"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url(${heroImage})`,
      }}
    >
      <div 
        className="hero-background"
        style={{
          transform: calculateTransform(),
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url(${heroImage})`,
        }}
      />
      <div className="hero-container">
        <div className="hero-text">
          <img src={artlogo} alt="Art Logo" className="art-logo" />
          <p className="hero-subtitle">
            Connect with fellow students, share resources, and achieve your Goals together.
          </p>
          <div className="button-container">
            <button className="primary-button">
              Get Started
            </button>
            <button className="secondary-button">
              Learn More...
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 