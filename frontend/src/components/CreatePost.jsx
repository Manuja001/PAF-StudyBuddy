import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import './CreatePost.css';

const CreatePost = () => {
  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: '',
    content: '',
    skillLevel: '',
    category: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/posts', post);
      navigate('/posts');
    } catch (err) {
      setError('Failed to create the post');
    }
  };

  return (
    <div className="create-post-container">
      <h2 className="create-post-title">Create New Post</h2>

      {error && <div className="error-message">{error}</div>}

      <form className="create-post-form" onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={post.title}
          onChange={handleChange}
          required
        />

        <label>Content:</label>
        <textarea
          name="content"
          value={post.content}
          onChange={handleChange}
          required
        ></textarea>

        <label>Skill Level:</label>
        <select
          name="skillLevel"
          value={post.skillLevel}
          onChange={handleChange}
          required
        >
          <option value="">Select skill level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <label>Category:</label>
        <select
          name="category"
          value={post.category}
          onChange={handleChange}
          required
        >
          <option value="">Select category</option>
          <option value="Programming">Programming</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Design">Design</option>
        </select>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreatePost;
