import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import './ViewStudyPlan.css';

const ViewStudyPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <div className="view-study-plan">
        <div className="study-plan-container">
          <div className="loading">Loading study plan...</div>
        </div>
      </div>
    );
  }

  if (error || !studyPlan) {
    return (
      <div className="view-study-plan">
        <div className="study-plan-container">
          <div className="error">{error || 'Study plan not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="view-study-plan">
      <div className="study-plan-container">
        <div className="study-plan-header">
          {studyPlan.imageUrl && (
            <img 
              src={`http://localhost:8080${studyPlan.imageUrl}`} 
              alt="Study Plan Cover" 
              className="cover-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/1200x300?text=No+Image';
              }}
            />
          )}
          <div className="header-content">
            <div className="title-section">
              <h1>{studyPlan.title}</h1>
              <button 
                className="delete-button"
                onClick={handleDelete}
                aria-label="Delete study plan"
              >
                <FiTrash2 />
              </button>
            </div>
            <p className="description">{studyPlan.description}</p>
          </div>
        </div>

        <div className="sessions">
          {studyPlan.sessions.map((session, sessionIndex) => (
            <div key={sessionIndex} className="session">
              <h2 className="session-title">{session.name}</h2>
              
              <div className="chapters">
                {session.chapters.map((chapter, chapterIndex) => (
                  <div key={chapterIndex} className="chapter">
                    <h3 className="chapter-title">{chapter.title}</h3>
                    <p className="chapter-description">{chapter.description}</p>
                    
                    <div className="todos">
                      <h4>Tasks</h4>
                      {chapter.todos.map((todo, todoIndex) => (
                        <div key={todoIndex} className="todo-item">
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            readOnly
                          />
                          <span className={todo.completed ? 'completed' : ''}>
                            {todo.text}
                          </span>
                        </div>
                      ))}
                    </div>

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
                          {resource.title}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewStudyPlan; 