import React from 'react';
import './ViewStudyPlan.css';

const ViewStudyPlan = () => {
  const studyPlan = {
    title: "Web Development Fundamentals",
    description: "A comprehensive study plan to master the basics of web development",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
    sessions: [
      {
        name: "HTML & CSS Basics",
        chapters: [
          {
            title: "Introduction to HTML",
            description: "Learn the fundamentals of HTML structure and basic elements",
            todos: [
              { text: "Study HTML document structure", completed: false },
              { text: "Practice with semantic elements", completed: true },
              { text: "Complete coding exercises", completed: false }
            ],
            resources: [
              { title: "MDN HTML Guide", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
              { title: "W3Schools HTML Tutorial", url: "https://www.w3schools.com/html/" }
            ]
          },
          {
            title: "CSS Fundamentals",
            description: "Master CSS styling and layout techniques",
            todos: [
              { text: "Learn CSS selectors", completed: true },
              { text: "Study CSS Box Model", completed: false },
              { text: "Practice Flexbox layouts", completed: false }
            ],
            resources: [
              { title: "CSS Tricks", url: "https://css-tricks.com" },
              { title: "Flexbox Froggy", url: "https://flexboxfroggy.com" }
            ]
          }
        ]
      },
      {
        name: "JavaScript Essentials",
        chapters: [
          {
            title: "JavaScript Basics",
            description: "Understanding JavaScript fundamentals and syntax",
            todos: [
              { text: "Study variables and data types", completed: true },
              { text: "Learn control structures", completed: false },
              { text: "Practice functions", completed: false }
            ],
            resources: [
              { title: "JavaScript.info", url: "https://javascript.info" },
              { title: "Eloquent JavaScript", url: "https://eloquentjavascript.net" }
            ]
          }
        ]
      }
    ]
  };

  return (
    <div className="view-study-plan">
      <div className="study-plan-container">
        <div className="study-plan-header">
          <img src={studyPlan.image} alt="Study Plan Cover" className="cover-image" />
          <h1>{studyPlan.title}</h1>
          <p className="description">{studyPlan.description}</p>
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