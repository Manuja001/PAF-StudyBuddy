import { useState } from 'react';
import axios from 'axios';

const CreateSkill = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [userId, setUserId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newSkill = {
      title,
      description,
      category,
      userId,
    };
    console.log(newSkill)

    // Sending a POST request to the backend to create a new skill
    axios.post('http://localhost:8080/api/skills', newSkill)
      .then((response) => {
        const createdSkill = response.data;

        // Log the full response (optional for debugging)
        console.log('Created skill:', createdSkill);

        // Show a success alert with skill title
        alert(`Post "${createdSkill.title}" Created Successfully!`);

        // Optionally reset form fields
        setTitle('');
        setDescription('');
        setCategory('');
        setUserId('');
      })
      .catch((error) => {
        console.error('There was an error creating the Skill!', error);
        alert('Failed to create the skill. Please try again.');
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create New Skill</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block">Title</label>
          <input 
            type="text" 
            id="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full p-2 border rounded" 
            required 
          />
        </div>
        <div>
          <label htmlFor="description" className="block">Description</label>
          <textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="w-full p-2 border rounded" 
            required 
          />
        </div>
        <div>
          <label htmlFor="category" className="block">Category</label>
          <input 
            type="text" 
            id="category" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            className="w-full p-2 border rounded" 
            required 
          />
        </div>
        <div>
          <label htmlFor="userId" className="block">User ID</label>
          <input 
            type="text" 
            id="userId" 
            value={userId} 
            onChange={(e) => setUserId(e.target.value)} 
            className="w-full p-2 border rounded" 
            required 
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default CreateSkill;
