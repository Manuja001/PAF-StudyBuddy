import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './StudyPlanList.css';

const StudyPlanList = () => {
  const [studyPlans, setStudyPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState('');
  const plansPerPage = 8;
  const navigate = useNavigate();

  const categories = [
    { id: 'programming', name: 'Programming' },
    { id: 'web-development', name: 'Web Development' },
    { id: 'photography', name: 'Photography' },
    { id: 'graphic-design', name: 'Graphic Design' }
  ];

  useEffect(() => {
    fetchStudyPlans();
  }, []);

  // Reset to first page when search query or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  const fetchStudyPlans = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/study-plans');
      if (!response.ok) {
        throw new Error('Failed to fetch study plans');
      }
      const data = await response.json();
      console.log('Fetched study plans:', data);
      
      // Process study plans to ensure they have category information
      const processedData = data.map(plan => {
        // If plan doesn't have a category, try to infer one from the title or description
        if (!plan.category) {
          const title = plan.title.toLowerCase();
          const description = plan.description.toLowerCase();
          
          if (title.includes('programming') || title.includes('coding') || 
              description.includes('programming') || description.includes('coding')) {
            return { ...plan, category: 'programming' };
          } else if (title.includes('web') || description.includes('web')) {
            return { ...plan, category: 'web-development' };
          } else if (title.includes('photo') || description.includes('photo')) {
            return { ...plan, category: 'photography' };
          } else if (title.includes('design') || description.includes('design')) {
            return { ...plan, category: 'graphic-design' };
          }
        }
        return plan;
      });
      
      setStudyPlans(processedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching study plans:', error);
      setError('Failed to load study plans. Please try again later.');
      setLoading(false);
    }
  };

  const filteredStudyPlans = studyPlans.filter(plan => {
    // First filter by search text
    const matchesSearch = 
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Then filter by category if one is selected
    if (activeCategory && plan.category) {
      return matchesSearch && plan.category.toLowerCase() === activeCategory.toLowerCase();
    }
    
    return matchesSearch;
  });

  // Calculate pagination
  const indexOfLastPlan = currentPage * plansPerPage;
  const indexOfFirstPlan = indexOfLastPlan - plansPerPage;
  const currentPlans = filteredStudyPlans.slice(indexOfFirstPlan, indexOfLastPlan);
  const totalPages = Math.ceil(filteredStudyPlans.length / plansPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        <FiChevronLeft />
      </button>
    );

    // First page
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`pagination-button ${currentPage === 1 ? 'active' : ''}`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`pagination-button ${currentPage === totalPages ? 'active' : ''}`}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        <FiChevronRight />
      </button>
    );

    return buttons;
  };

  const handleEnterPlan = (planId) => {
    navigate(`/view-study-plan/${planId}`);
  };

  const handleDeleteClick = (plan, event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Delete button clicked for plan:', plan.id);
    setPlanToDelete(plan);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!planToDelete) return;
    
    try {
      console.log(`Attempting to delete study plan with ID: ${planToDelete.id}`);
      
      const response = await fetch(`http://localhost:8080/api/study-plans/${planToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Delete response:', response);
      console.log('Delete response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Delete failed. Server response:', errorData);
        throw new Error(`Failed to delete study plan: ${errorData}`);
      }
      
      console.log('Study plan deleted successfully');
      setStudyPlans(prevPlans => prevPlans.filter(plan => plan.id !== planToDelete.id));
      setShowConfirmDialog(false);
      setPlanToDelete(null);
    } catch (error) {
      console.error('Error in handleDeletePlan:', error);
      alert(error.message || 'Failed to delete study plan. Please try again.');
    }
  };

  const handleCancelDelete = () => {
    console.log('Delete cancelled by user');
    setShowConfirmDialog(false);
    setPlanToDelete(null);
  };

  if (loading) {
    return (
      <div className="study-plans-container">
        <div className="loading">Loading study plans...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="study-plans-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="study-plans-container">
      <div className="search-container">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search study plans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="category-filters">
          <button 
            className={`category-button ${activeCategory === '' ? 'active' : ''}`} 
            onClick={() => setActiveCategory('')}
          >
            All
          </button>
          {categories.map(category => (
            <button 
              key={category.id}
              className={`category-button ${activeCategory === category.id ? 'active' : ''}`} 
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && planToDelete && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <h3>Delete Study Plan</h3>
            <p>Are you sure you want to delete "{planToDelete.title}"?</p>
            <p>This action cannot be undone.</p>
            <div className="confirm-dialog-buttons">
              <button onClick={handleCancelDelete} className="cancel-button">
                Cancel
              </button>
              <button onClick={handleConfirmDelete} className="confirm-button">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="study-plans-grid">
        {currentPlans.map((plan) => (
          <div key={plan.id} className="study-plan-card">
            {plan.imageUrl ? (
              <img 
                src={`http://localhost:8080${plan.imageUrl}`} 
                alt={plan.title} 
                className="plan-image"
                onError={(e) => {
                  e.target.onerror = null;
                  // Using a simple gray background with text as data URL
                  e.target.src = 'data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3e%3crect width="300" height="200" fill="%23f0f0f0"/%3e%3ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23666" font-family="Arial" font-size="16"%3eNo Image%3c/text%3e%3c/svg%3e';
                }}
              />
            ) : (
              <div className="plan-image-placeholder">No Image</div>
            )}
            <div className="plan-content">
              <div className="plan-header">
                <h2>{plan.title}</h2>
                <button 
                  type="button"
                  className="delete-button"
                  onClick={(e) => handleDeleteClick(plan, e)}
                  aria-label="Delete study plan"
                >
                  <FiTrash2 />
                </button>
              </div>
              <p>{plan.description}</p>
              <button 
                className="enter-button"
                onClick={() => handleEnterPlan(plan.id)}
              >
                Enter <FiArrowRight />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredStudyPlans.length > 0 && (
        <div className="pagination">
          {renderPaginationButtons()}
        </div>
      )}

      {filteredStudyPlans.length === 0 && !loading && (
        <div className="no-plans">
          {searchQuery 
            ? "No study plans found matching your search."
            : "No study plans found. Create your first study plan!"}
        </div>
      )}
    </div>
  );
};

export default StudyPlanList; 