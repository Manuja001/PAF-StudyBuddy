import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../config/axios";
import Comments from "./Comments";
import "./Post.css";

const Post = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (postId) {
      fetchPost();
    } else {
      setError("No post ID provided");
      setLoading(false);
    }
  }, [postId]);

  // Clear message after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching post with ID:", postId);
      const response = await axios.get(`/api/posts/${postId}`);
      console.log("Post response:", response.data);

      if (!response.data) {
        throw new Error("Post not found");
      }
      setPost(response.data);
      setEditedTitle(response.data.title || "");
      setEditedContent(response.data.content || "");
    } catch (error) {
      console.error("Error fetching post:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
      setError(
        error.response?.data?.message ||
          "Failed to load post. Please try again later."
      );
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = async () => {
    if (!editedTitle.trim() || !editedContent.trim()) {
      setMessage({ text: "Title and content cannot be empty", type: "error" });
      return;
    }

    try {
      setMessage({ text: "Updating post...", type: "info" });
      const response = await axios.put(`/api/posts/${postId}`, {
        title: editedTitle,
        content: editedContent,
      });

      setPost(response.data);
      setIsEditing(false);
      setMessage({ text: "Post updated successfully!", type: "success" });
    } catch (error) {
      console.error("Error updating post:", error);
      setMessage({
        text:
          error.response?.data?.message ||
          "Failed to update post. Please try again.",
        type: "error",
      });
    }
  };

  const handleDeletePost = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setMessage({ text: "Deleting post...", type: "info" });
      await axios.delete(`/api/posts/${postId}`);
      setMessage({ text: "Post deleted successfully!", type: "success" });
      setTimeout(() => navigate("/posts"), 1500);
    } catch (error) {
      console.error("Error deleting post:", error);
      setMessage({
        text:
          error.response?.data?.message ||
          "Failed to delete post. Please try again.",
        type: "error",
      });
    }
  };

  if (loading) return <div className="loading">Loading post...</div>;
  if (error)
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button onClick={() => navigate("/posts")} className="back-button">
          ← Back to Posts
        </button>
      </div>
    );
  if (!post)
    return (
      <div className="error-container">
        <div className="error">Post not found</div>
        <button onClick={() => navigate("/posts")} className="back-button">
          ← Back to Posts
        </button>
      </div>
    );

  return (
    <div className="post-container">
      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <div className="post-header">
        <button onClick={() => navigate("/posts")} className="back-button">
          ← Back to Posts
        </button>
        <div className="post-actions">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="edit-button"
          >
            {isEditing ? "Cancel Edit" : "Edit Post"}
          </button>
          <button onClick={handleDeletePost} className="delete-button">
            Delete Post
          </button>
        </div>
      </div>

      <div className="post-content">
        {isEditing ? (
          <div className="edit-form">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Post title"
              className="edit-title"
              required
            />
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Post content"
              className="edit-content"
              required
            />
            <button
              onClick={handleUpdatePost}
              disabled={!editedTitle.trim() || !editedContent.trim()}
              className="save-button"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
          </>
        )}
      </div>

      <div className="comments-section">
        <Comments postId={postId} />
      </div>
    </div>
  );
};

export default Post;
