import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Comments.css';
import axios from '../config/axios';

// Confirmation Dialog Component
const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <p>{message}</p>
        <div className="confirm-actions">
          <button onClick={onConfirm} className="confirm-btn">OK</button>
          <button onClick={onCancel} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

// Configure axios base URL and defaults
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const Comments = () => {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // For success/error messages
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    message: '',
    onConfirm: null
  });

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  // Clear message after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/posts/${postId}/comments`);
      const commentsWithIds = Array.isArray(response.data) ? response.data.map(comment => ({
        ...comment,
        _id: comment._id || comment.id || Math.random().toString(36).substr(2, 9)
      })) : [];
      setComments(commentsWithIds);
    } catch (error) {
      console.error('Error fetching comments:', error.response || error);
      showMessage('Failed to load comments. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    try {
      setSubmitting(true);
      const response = await axios.post(`/api/posts/${postId}/comments`, {
        content: newComment,
      });
      const newCommentWithId = {
        ...response.data,
        _id: response.data._id || response.data.id || Math.random().toString(36).substr(2, 9)
      };
      setComments(prevComments => [newCommentWithId, ...prevComments]);
      setNewComment('');
      showMessage('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error.response || error);
      showMessage('Failed to add comment. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const showConfirmDialog = (message, onConfirm) => {
    setConfirmDialog({
      isOpen: true,
      message,
      onConfirm
    });
  };

  const handleConfirm = async () => {
    if (confirmDialog.onConfirm) {
      await confirmDialog.onConfirm();
    }
    setConfirmDialog({ isOpen: false, message: '', onConfirm: null });
  };

  const handleCancel = () => {
    setConfirmDialog({ isOpen: false, message: '', onConfirm: null });
  };

  const handleUpdateComment = async (commentId) => {
    if (!editText.trim()) return;

    showConfirmDialog(
      'Are you sure you want to update this comment?',
      async () => {
        try {
          const response = await axios.put(`/api/comments/${commentId}`, {
            content: editText,
            postId: postId
          });

          if (response.data) {
            setComments(prevComments => 
              prevComments.map(comment => 
                comment._id === commentId ? { ...comment, content: editText } : comment
              )
            );
            setEditingComment(null);
            setEditText('');
            showMessage('Comment updated successfully!');
          }
        } catch (error) {
          console.error('Error updating comment:', error.response || error);
          showMessage('Failed to update comment. Please try again.', 'error');
        }
      }
    );
  };

  const handleDeleteComment = async (commentId) => {
    showConfirmDialog(
      'Are you sure you want to delete this comment? This action cannot be undone.',
      async () => {
        try {
          const response = await axios.delete(`/api/comments/${commentId}`);

          if (response.status === 200 || response.status === 204) {
            setComments(prevComments => 
              prevComments.filter(comment => comment._id !== commentId)
            );
            showMessage('Comment deleted successfully!');
          } else {
            throw new Error('Failed to delete comment');
          }
        } catch (error) {
          console.error('Error deleting comment:', error.response || error);
          showMessage('Failed to delete comment. Please try again.', 'error');
        }
      }
    );
  };

  if (!postId) {
    return <div className="error">No post ID provided</div>;
  }

  return (
    <div className="comments-container">
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        message={confirmDialog.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      
      <h2>Comments ({comments.length})</h2>
      
      {/* Message popup */}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleAddComment} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          required
          disabled={submitting}
        />
        <button 
          type="submit" 
          disabled={!newComment.trim() || submitting}
          className={submitting ? 'submitting' : ''}
        >
          {submitting ? 'Adding...' : 'Add Comment'}
        </button>
      </form>

      {loading && <div className="loading">Loading comments...</div>}
      
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <div className="comments-list">
          {comments.length === 0 ? (
            <p>No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => {
              const commentId = comment._id || comment.id;
              return (
                <div key={commentId} className="comment-item">
                  {editingComment === commentId ? (
                    <div className="edit-form">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        required
                      />
                      <div className="edit-actions">
                        <button 
                          onClick={() => handleUpdateComment(commentId)}
                          disabled={!editText.trim()}
                          className="save-btn"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => {
                            setEditingComment(null);
                            setEditText('');
                          }}
                          className="cancel-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p>{comment.content}</p>
                      <div className="comment-actions">
                        <button 
                          onClick={() => {
                            setEditingComment(commentId);
                            setEditText(comment.content);
                          }}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteComment(commentId)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Comments; 