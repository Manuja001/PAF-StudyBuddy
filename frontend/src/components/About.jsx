import React from 'react';
import './About.css';
import aboutImage from '../assets/about-image.jpg';

const About = () => {
  const stats = [
    { number: '10K+', label: 'Active Students' },
    { number: '500+', label: 'Study Groups' },
    { number: '95%', label: 'Success Rate' }
  ];

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-grid">
          <div className="about-content">
       
            <h2 className="about-title">
              Transforming Education Through <span className="highlight">Collaborative Learning</span>
            </h2>
            <p className="about-description">
              StudyBuddy is revolutionizing the way students learn and grow together. We believe in the 
              power of collaborative learning and peer-to-peer support. Our platform connects ambitious 
              students, enabling them to share knowledge, resources, and experiences in a supportive 
              environment.
            </p>
            <p className="about-description">
              Whether you're preparing for exams, working on projects, or mastering new skills, 
              StudyBuddy provides the tools and community you need to succeed. Join thousands of 
              students who are already achieving their academic goals through collaborative learning.
            </p>
            <div className="about-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="about-image">
            <img 
              src={aboutImage} 
              alt="Students collaborating and studying together" 
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 