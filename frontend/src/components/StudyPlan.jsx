import React, { useState } from 'react';
import './StudyPlan.css';

const StudyPlan = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({
    name: '',
    hours: '',
    priority: 'medium',
    deadline: ''
  });

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (newSubject.name && newSubject.hours) {
      setSubjects([...subjects, { ...newSubject, id: Date.now() }]);
      setNewSubject({
        name: '',
        hours: '',
        priority: 'medium',
        deadline: ''
      });
    }
  };

  const handleDeleteSubject = (id) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-600';
      case 'medium': return 'bg-yellow-100 text-yellow-600';
      case 'low': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <section className="study-plan-section">
      <div className="study-plan-container">
        <div className="study-plan-header">
          <h2 className="study-plan-title">Create Your Study Plan</h2>
          <p className="study-plan-description">
            Organize your study schedule effectively by adding subjects, allocating time, and setting priorities.
          </p>
        </div>

        <div className="study-plan-content">
          <div className="study-plan-form">
            <h3 className="form-title">Add New Subject</h3>
            <form onSubmit={handleAddSubject}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Subject Name</label>
                  <input
                    type="text"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                    placeholder="Enter subject name"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Study Hours</label>
                  <input
                    type="number"
                    value={newSubject.hours}
                    onChange={(e) => setNewSubject({ ...newSubject, hours: e.target.value })}
                    placeholder="Hours per week"
                    className="form-input"
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={newSubject.priority}
                    onChange={(e) => setNewSubject({ ...newSubject, priority: e.target.value })}
                    className="form-input"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Deadline</label>
                  <input
                    type="date"
                    value={newSubject.deadline}
                    onChange={(e) => setNewSubject({ ...newSubject, deadline: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <button type="submit" className="add-subject-btn">
                Add Subject
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="btn-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </form>
          </div>

          <div className="subjects-list">
            <h3 className="list-title">Your Study Plan</h3>
            {subjects.length === 0 ? (
              <div className="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="empty-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p>No subjects added yet. Start by adding a subject to your study plan.</p>
              </div>
            ) : (
              <div className="subjects-grid">
                {subjects.map((subject) => (
                  <div key={subject.id} className="subject-card">
                    <div className="subject-header">
                      <h4 className="subject-name">{subject.name}</h4>
                      <button
                        onClick={() => handleDeleteSubject(subject.id)}
                        className="delete-btn"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="subject-details">
                      <span className="hours">{subject.hours} hours/week</span>
                      <span className={`priority ${getPriorityColor(subject.priority)}`}>
                        {subject.priority}
                      </span>
                      {subject.deadline && (
                        <span className="deadline">Due: {new Date(subject.deadline).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudyPlan; 