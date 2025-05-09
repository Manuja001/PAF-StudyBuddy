import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../config/axios";
import "./Posts.css";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/posts");
      if (!response.data) {
        throw new Error("No posts found");
      }
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(
        error.response?.data?.message ||
          "Failed to load posts. Please try again later."
      );
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredPosts = posts.filter((post) => {
    const lowercasedQuery = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(lowercasedQuery) ||
      post.content.toLowerCase().includes(lowercasedQuery)
    );
  });

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!posts.length)
    return (
      <div className="no-posts">No posts found. Create your first post!</div>
    );

  return (
    <div className="posts-container">
      <h1>Study Posts</h1>
      
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search posts..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />
      
      <div className="posts-grid">
        {filteredPosts.map((post) => (
          <Link to={`/posts/${post.id}`} key={post.id} className="post-card">
            <h2>{post.title}</h2>
            <p>{post.content.substring(0, 150)}...</p>
            <div className="post-footer">
              <span className="comments-count">
                {post.comments?.length || 0} comments
              </span>
              <span className="view-more">View Post →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Posts;
