import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiTrash2, FiBook, FiCheckCircle, FiCircle } from 'react-icons/fi';
import './ViewStudyPlan.css';

const ViewStudyPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSession, setActiveSession] = useState(0);

  useEffect(() => {
    fetchStudyPlan();
  }, [id]);

  const fetchStudyPlan = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/study-plans/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch study plan');
      }
      const data = await response.json();
      setStudyPlan(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching study plan:', error);
      setError('Failed to load study plan. Please try again later.');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this study plan?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/study-plans/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete study plan');
        }
        
        // Navigate back to the study plans list
        navigate('/view-study-plan');
      } catch (error) {
        console.error('Error deleting study plan:', error);
        alert('Failed to delete study plan. Please try again.');
      }
    }
  };

  // Calculate progress for each session
  const calculateSessionProgress = (session) => {
    if (!session.chapters) return 0;
    
    let totalTodos = 0;
    let completedTodos = 0;
    
    session.chapters.forEach(chapter => {
      if (chapter.todos) {
        totalTodos += chapter.todos.length;
        completedTodos += chapter.todos.filter(todo => todo.completed).length;
      }
    });
    
    return totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);
  };

  // Toggle todo completion status
  const toggleTodoCompletion = (chapterIndex, todoIndex) => {
    const updatedStudyPlan = { ...studyPlan };
    const todo = updatedStudyPlan.sessions[activeSession].chapters[chapterIndex].todos[todoIndex];
    todo.completed = !todo.completed;
    
    setStudyPlan(updatedStudyPlan);
    
    // In a real app, you would also update the backend
    // For now we'll just update the local state
    console.log(`Todo "${todo.text}" marked as ${todo.completed ? 'completed' : 'incomplete'}`);
    
    // Ideally, you'd send an update to your API here
    // updateTodoInBackend(todo.id, todo.completed);
  };

  if (loading) {
    return (
      <div className="view-study-plan">
        <div className="loading">Loading study plan...</div>
      </div>
    );
  }

  if (error || !studyPlan) {
    return (
      <div className="view-study-plan">
        <div className="error">{error || 'Study plan not found'}</div>
      </div>
    );
  }

  return (
    <div className="view-study-plan">
      <div className="study-plan-layout">
        {/* Sidebar navigation */}
        <div className="study-plan-sidebar">
          <div className="sidebar-header">
            {studyPlan.imageUrl ? (
              <div className="sidebar-image-container">
                <img 
                  src={`http://localhost:8080${studyPlan.imageUrl}`} 
                  alt="Study Plan Cover" 
                  className="sidebar-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x180?text=No+Image';
                  }}
                />
                <div className="sidebar-image-overlay"></div>
              </div>
            ) : (
              <div className="sidebar-image-placeholder">
                <FiBook className="placeholder-icon" />
              </div>
            )}
            <div className="sidebar-content">
              <h2 className="sidebar-title">{studyPlan.title}</h2>
              <p className="sidebar-description">{studyPlan.description}</p>
              <button 
                className="delete-button sidebar-delete"
                onClick={handleDelete}
                aria-label="Delete study plan"
              >
                <FiTrash2 /> Delete Study Plan
              </button>
            </div>
          </div>
          
          <div className="sidebar-sessions">
            <h3 className="sidebar-subtitle">Sessions</h3>
            <ul className="sessions-list">
              {studyPlan.sessions.map((session, index) => {
                const progress = calculateSessionProgress(session);
                return (
                  <li 
                    key={index} 
                    className={`session-nav-item ${activeSession === index ? 'active' : ''}`}
                    onClick={() => setActiveSession(index)}
                  >
                    <div className="session-nav-content">
                      <span className="session-nav-title">{session.name}</span>
                      <div className="session-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${progress}%` }}
                            aria-valuenow={progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <span className="progress-text">{progress}%</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Main content area */}
        <div className="study-plan-content">
          {studyPlan.sessions.length > 0 && (
            <div className="content-container">
              <div className="session-header">
                <h1 className="session-title">{studyPlan.sessions[activeSession].name}</h1>
                <div className="session-progress-indicator">
                  <div className="progress-circle">
                    <span className="progress-percentage">
                      {calculateSessionProgress(studyPlan.sessions[activeSession])}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="chapters-container">
                {studyPlan.sessions[activeSession].chapters.map((chapter, chapterIndex) => (
                  <div key={chapterIndex} className="chapter">
                    <h3 className="chapter-title">{chapter.title}</h3>
                    {chapter.description && (
                      <p className="chapter-description">{chapter.description}</p>
                    )}
                    
                    {chapter.todos && chapter.todos.length > 0 && (
                      <div className="todos">
                        <h4>Tasks</h4>
                        {chapter.todos.map((todo, todoIndex) => (
                          <div 
                            key={todoIndex} 
                            className="todo-item"
                            onClick={() => toggleTodoCompletion(chapterIndex, todoIndex)}
                          >
                            <div className="todo-checkbox">
                              {todo.completed ? (
                                <FiCheckCircle className="checkbox-icon completed" />
                              ) : (
                                <FiCircle className="checkbox-icon" />
                              )}
                            </div>
                            <span className={todo.completed ? 'completed' : ''}>
                              {todo.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {chapter.resources && chapter.resources.length > 0 && (
                      <div className="resources">
                        <h4>Resources</h4>
                        {chapter.resources.map((resource, resourceIndex) => (
                          <a
                            key={resourceIndex}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resource-link"
                          >
                            {resource.title || resource.url}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewStudyPlan; 