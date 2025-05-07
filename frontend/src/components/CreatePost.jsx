import { useState } from 'react';
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

  const [showOtherCategory, setShowOtherCategory] = useState(false);
  const [otherCategory, setOtherCategory] = useState('');
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'category') {
      if (value === 'Other') {
        setShowOtherCategory(true);
        setPost((prevPost) => ({
          ...prevPost,
          category: '', // temporarily clear category
        }));
      } else {
        setShowOtherCategory(false);
        setPost((prevPost) => ({
          ...prevPost,
          category: value,
        }));
      }
    } else {
      setPost((prevPost) => ({
        ...prevPost,
        [name]: value,
      }));
    }
  };

  const handleOtherCategoryChange = (e) => {
    const value = e.target.value;
    setOtherCategory(value);
    setPost((prevPost) => ({
      ...prevPost,
      category: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/posts', post);
      navigate('/posts');
    } catch {
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
          value={showOtherCategory ? 'Other' : post.category}
          onChange={handleChange}
          required
        >
          <option value="">Select category</option>
          <option value="Programming">Programming</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Design">Design</option>
          <option value="Other">Other</option>
        </select>

        {showOtherCategory && (
          <>
            <label>Other Category:</label>
            <input
              type="text"
              value={otherCategory}
              onChange={handleOtherCategoryChange}
              placeholder="Enter your category"
              required
            />
          </>
        )}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreatePost;
