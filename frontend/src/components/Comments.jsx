import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Comments.css";
import axios from "../config/axios";
import PropTypes from "prop-types";

const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <p>{message}</p>
        <div className="confirm-actions">
          <button onClick={onConfirm} className="confirm-btn">
            OK
          </button>
          <button onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const Comments = () => {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const showMessage = (text, type = "success") => setMessage({ text, type });

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/posts/${postId}/comments`);
      const data = Array.isArray(response.data) ? response.data : [];
      const formatted = data.map((c) => ({
        ...c,
        _id: c._id || c.id || crypto.randomUUID(),
        createdAt: c.createdAt || new Date().toISOString(),
      }));
      setComments(formatted);
    } catch (err) {
      console.error("Fetch error:", err);
      showMessage("Failed to load comments.", "error");
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
      const created = {
        ...response.data,
        _id: response.data._id || response.data.id || crypto.randomUUID(),
        createdAt: response.data.createdAt || new Date().toISOString(),
      };
      setComments([created, ...comments]);
      setNewComment("");
      showMessage("Comment added successfully!");
    } catch (err) {
      console.error("Add error:", err);
      showMessage("Failed to add comment.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const showConfirmDialog = (message, onConfirm) => {
    setConfirmDialog({ isOpen: true, message, onConfirm });
  };

  const handleConfirm = async () => {
    if (confirmDialog.onConfirm) await confirmDialog.onConfirm();
    setConfirmDialog({ isOpen: false, message: "", onConfirm: null });
  };

  const handleCancel = () =>
    setConfirmDialog({ isOpen: false, message: "", onConfirm: null });

  const handleUpdateComment = async (commentId) => {
    if (!editText.trim()) return;

    showConfirmDialog("Update this comment?", async () => {
      try {
        const res = await axios.put(`/api/comments/${commentId}`, {
          content: editText,
          postId,
        });
        if (res.data) {
          setComments(
            comments.map((c) =>
              c._id === commentId ? { ...c, content: editText } : c
            )
          );
          setEditingComment(null);
          setEditText("");
          showMessage("Comment updated!");
        }
      } catch (err) {
        console.error("Update error:", err);
        showMessage("Failed to update comment.", "error");
      }
    });
  };

  const handleDeleteComment = async (commentId) => {
    showConfirmDialog("Delete this comment?", async () => {
      try {
        const res = await axios.delete(`/api/comments/${commentId}`);
        if (res.status === 200 || res.status === 204) {
          setComments(comments.filter((c) => c._id !== commentId));
          showMessage("Comment deleted!");
        } else {
          throw new Error("Delete failed");
        }
      } catch (err) {
        console.error("Delete error:", err);
        showMessage("Failed to delete comment.", "error");
      }
    });
  };

  const toggleSortOrder = () => {
    const sortIcon = document.querySelector(".sort-icon");
    if (sortIcon) {
      sortIcon.classList.add("changing");
      setTimeout(() => sortIcon.classList.remove("changing"), 600);
    }
    setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
  };

  const sortedComments = [...comments].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  if (!postId) return <div className="error">Post ID missing.</div>;

  return (
    <div className="comments-container">
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        message={confirmDialog.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <h2>Comments ({comments.length})</h2>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
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
          className={submitting ? "submitting" : ""}
        >
          {submitting ? "Adding..." : "Add Comment"}
        </button>
      </form>

      <div className="sort-section">
        <button onClick={toggleSortOrder} className="sort-btn">
          <span className="sort-icon">
            {sortOrder === "newest" ? (
              <svg className="sort-arrow" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            ) : (
              <svg className="sort-arrow" viewBox="0 0 24 24">
                <path d="M7 14l5-5 5 5z" />
              </svg>
            )}
          </span>
          {sortOrder === "newest" ? "Newest First" : "Oldest First"}
          <span className="sort-effect"></span>
        </button>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {!loading && comments.length === 0 && <p>No comments yet.</p>}

      <div className="comments-list">
        {sortedComments.map((comment) => {
          const id = comment._id;
          return (
            <div key={id} className="comment-item">
              {editingComment === id ? (
                <div className="edit-form">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    required
                  />
                  <div className="edit-actions">
                    <button
                      onClick={() => handleUpdateComment(id)}
                      className="save-btn"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingComment(null);
                        setEditText("");
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
                  <div className="comment-meta">
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                    <div className="comment-actions">
                      <button
                        onClick={() => {
                          setEditingComment(id);
                          setEditText(comment.content);
                        }}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Comments;
