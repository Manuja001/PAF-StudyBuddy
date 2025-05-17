import React, { useState } from 'react';
import { FiPlus, FiUpload, FiLink, FiChevronDown, FiChevronUp, FiTrash2, FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './CreateStudyPlan.css';

const CreateStudyPlan = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studyPlan, setStudyPlan] = useState({
    name: '',
    timePeriod: '',
    description: '',
    image: null,
    imagePreview: null,
    softwares: [],
    sessions: [
      {
        id: 1,
        name: '',
        chapters: [
          {
            id: 1,
            name: '',
            isExpanded: true,
            todos: [],
            resources: []
          }
        ]
      }
    ]
  });

  const [softwareInput, setSoftwareInput] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStudyPlan({
        ...studyPlan,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const addSoftware = () => {
    if (softwareInput.trim()) {
      setStudyPlan({
        ...studyPlan,
        softwares: [...studyPlan.softwares, softwareInput.trim()]
      });
      setSoftwareInput('');
    }
  };

  const removeSoftware = (index) => {
    const newSoftwares = studyPlan.softwares.filter((_, i) => i !== index);
    setStudyPlan({ ...studyPlan, softwares: newSoftwares });
  };

  const addSession = () => {
    const newSession = {
      id: Date.now(),
      name: '',
      chapters: [
        {
          id: Date.now() + 1,
          name: '',
          isExpanded: true,
          todos: [],
          resources: []
        }
      ]
    };
    setStudyPlan({
      ...studyPlan,
      sessions: [...studyPlan.sessions, newSession]
    });
  };

  const addChapter = (sessionIndex) => {
    const newChapter = {
      id: Date.now(),
      name: '',
      isExpanded: true,
      todos: [],
      resources: []
    };
    const updatedSessions = [...studyPlan.sessions];
    updatedSessions[sessionIndex].chapters.push(newChapter);
    setStudyPlan({ ...studyPlan, sessions: updatedSessions });
  };

  const toggleChapter = (sessionIndex, chapterIndex) => {
    const updatedSessions = [...studyPlan.sessions];
    updatedSessions[sessionIndex].chapters[chapterIndex].isExpanded = 
      !updatedSessions[sessionIndex].chapters[chapterIndex].isExpanded;
    setStudyPlan({ ...studyPlan, sessions: updatedSessions });
  };

  const addTodo = (sessionIndex, chapterIndex) => {
    const updatedSessions = [...studyPlan.sessions];
    updatedSessions[sessionIndex].chapters[chapterIndex].todos.push({
      id: Date.now(),
      text: '',
      completed: false
    });
    setStudyPlan({ ...studyPlan, sessions: updatedSessions });
  };

  const addResource = (sessionIndex, chapterIndex) => {
    const updatedSessions = [...studyPlan.sessions];
    updatedSessions[sessionIndex].chapters[chapterIndex].resources.push({
      id: Date.now(),
      url: ''
    });
    setStudyPlan({ ...studyPlan, sessions: updatedSessions });
  };

  const transformDataForBackend = () => {
    const formData = new FormData();
    
    // Transform the study plan data
    const studyPlanData = {
      title: studyPlan.name,
      description: studyPlan.description,
      sessions: studyPlan.sessions.map(session => ({
        name: session.name,
        chapters: session.chapters.map(chapter => ({
          title: chapter.name,
          description: '', // You might want to add a description field to your form
          todos: chapter.todos.map(todo => ({
            text: todo.text,
            completed: todo.completed
          })),
          resources: chapter.resources.map(resource => ({
            title: resource.url, // You might want to add a title field to your form
            url: resource.url
          }))
        }))
      }))
    };

    // Add the study plan data as a JSON string
    formData.append('studyPlan', JSON.stringify(studyPlanData));
    
    // Add the image if it exists
    if (studyPlan.image) {
      formData.append('image', studyPlan.image);
    }

    return formData;
  };

  const testBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/test');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      console.log('Backend connection test:', text);
      return true;
    } catch (error) {
      console.error('Backend connection test failed:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Test connection first
      const isConnected = await testBackendConnection();
      if (!isConnected) {
        throw new Error('Cannot connect to backend server. Please make sure it is running.');
      }

      const formData = transformDataForBackend();
      
      const response = await fetch('http://localhost:8080/api/study-plans', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create study plan');
      }

      const result = await response.json();
      console.log('Study plan created:', result);
      
      // Navigate to the view page
      navigate('/view-study-plan');
    } catch (error) {
      console.error('Error creating study plan:', error);
      alert(error.message || 'Failed to create study plan. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-study-plan">
      <form onSubmit={handleSubmit} className="study-plan-form">
        <h1>Create Study Plan</h1>
        
        {/* Basic Information Section */}
        <div className="form-section">
          <h2>Basic Information</h2>
          <div className="form-group">
            <label>Study Plan Name</label>
            <input
              type="text"
              value={studyPlan.name}
              onChange={(e) => setStudyPlan({ ...studyPlan, name: e.target.value })}
              placeholder="Enter study plan name"
              required
            />
          </div>

          <div className="form-group">
            <label>Time Period</label>
            <input
              type="date"
              value={studyPlan.timePeriod}
              onChange={(e) => setStudyPlan({ ...studyPlan, timePeriod: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={studyPlan.description}
              onChange={(e) => setStudyPlan({ ...studyPlan, description: e.target.value })}
              placeholder="Describe your study plan"
              rows="4"
              required
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="form-section">
          <h2>Cover Image</h2>
          <div className="image-upload-container">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label htmlFor="image-upload" className="image-upload-label">
              {studyPlan.imagePreview ? (
                <img src={studyPlan.imagePreview} alt="Preview" className="image-preview" />
              ) : (
                <div className="upload-placeholder">
                  <FiUpload className="upload-icon" />
                  <span>Click to upload image</span>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Software Section */}
        <div className="form-section">
          <h2>Required Software</h2>
          <div className="software-input-container">
            <input
              type="text"
              value={softwareInput}
              onChange={(e) => setSoftwareInput(e.target.value)}
              placeholder="Add software"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSoftware())}
            />
            <button type="button" onClick={addSoftware} className="add-button">
              <FiPlus />
            </button>
          </div>
          <div className="software-tags">
            {studyPlan.softwares.map((software, index) => (
              <div key={index} className="software-tag">
                <span>{software}</span>
                <button type="button" onClick={() => removeSoftware(index)}>
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sessions Section */}
        <div className="form-section">
          <h2>Sessions</h2>
          {studyPlan.sessions.map((session, sessionIndex) => (
            <div key={session.id} className="session-card">
              <input
                type="text"
                value={session.name}
                onChange={(e) => {
                  const updatedSessions = [...studyPlan.sessions];
                  updatedSessions[sessionIndex].name = e.target.value;
                  setStudyPlan({ ...studyPlan, sessions: updatedSessions });
                }}
                placeholder="Session Name"
                className="session-name-input"
              />

              {/* Chapters */}
              <div className="chapters-container">
                {session.chapters.map((chapter, chapterIndex) => (
                  <div key={chapter.id} className="chapter-card">
                    <div 
                      className="chapter-header"
                      onClick={() => toggleChapter(sessionIndex, chapterIndex)}
                    >
                      <input
                        type="text"
                        value={chapter.name}
                        onChange={(e) => {
                          const updatedSessions = [...studyPlan.sessions];
                          updatedSessions[sessionIndex].chapters[chapterIndex].name = e.target.value;
                          setStudyPlan({ ...studyPlan, sessions: updatedSessions });
                        }}
                        placeholder="Chapter Name"
                        onClick={(e) => e.stopPropagation()}
                      />
                      {chapter.isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                    </div>

                    {chapter.isExpanded && (
                      <div className="chapter-content">
                        {/* To-Do List */}
                        <div className="todo-section">
                          <h4>To-Do List</h4>
                          {chapter.todos.map((todo, todoIndex) => (
                            <div key={todo.id} className="todo-item">
                              <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => {
                                  const updatedSessions = [...studyPlan.sessions];
                                  updatedSessions[sessionIndex].chapters[chapterIndex].todos[todoIndex].completed = 
                                    !todo.completed;
                                  setStudyPlan({ ...studyPlan, sessions: updatedSessions });
                                }}
                              />
                              <input
                                type="text"
                                value={todo.text}
                                onChange={(e) => {
                                  const updatedSessions = [...studyPlan.sessions];
                                  updatedSessions[sessionIndex].chapters[chapterIndex].todos[todoIndex].text = e.target.value;
                                  setStudyPlan({ ...studyPlan, sessions: updatedSessions });
                                }}
                                placeholder="Add a task"
                              />
                            </div>
                          ))}
                          <button 
                            type="button" 
                            onClick={() => addTodo(sessionIndex, chapterIndex)}
                            className="add-button"
                          >
                            <FiPlus /> Add Task
                          </button>
                        </div>

                        {/* Resource Links */}
                        <div className="resources-section">
                          <h4>Resource Links</h4>
                          {chapter.resources.map((resource, resourceIndex) => (
                            <div key={resource.id} className="resource-item">
                              <input
                                type="url"
                                value={resource.url}
                                onChange={(e) => {
                                  const updatedSessions = [...studyPlan.sessions];
                                  updatedSessions[sessionIndex].chapters[chapterIndex].resources[resourceIndex].url = e.target.value;
                                  setStudyPlan({ ...studyPlan, sessions: updatedSessions });
                                }}
                                placeholder="Enter resource URL"
                              />
                              <FiLink className="resource-icon" />
                            </div>
                          ))}
                          <button 
                            type="button" 
                            onClick={() => addResource(sessionIndex, chapterIndex)}
                            className="add-button"
                          >
                            <FiPlus /> Add Resource
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addChapter(sessionIndex)}
                  className="add-button"
                >
                  <FiPlus /> Add Chapter
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addSession} className="add-button add-session-button">
            <FiPlus /> Add Session
          </button>
        </div>

        <button 
          type="submit" 
          className="save-button" 
          disabled={isSubmitting}
        >
          <FiCheck /> {isSubmitting ? 'Saving...' : 'Save Study Plan'}
        </button>
      </form>
    </div>
  );
};

export default CreateStudyPlan; 