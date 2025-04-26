import { useEffect, useState } from 'react';
import axios from 'axios';

const SkillList = () => {
  const [skills, setSkills] = useState([]);
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [editedSkill, setEditedSkill] = useState({
    title: '',
    description: '',
    category: ''
  });

  // Fetch skills from backend
  const fetchSkills = () => {
    axios.get('http://localhost:8080/api/skills')
      .then(response => {
        setSkills(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the skills!', error);
      });
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      axios.delete(`http://localhost:8080/api/skills/${id}`)
        .then(() => {
          alert('Skill deleted successfully!');
          fetchSkills();
        })
        .catch(error => {
          console.error('There was an error deleting the skill!', error);
          alert('Failed to delete the skill.');
        });
    }
  };

  const handleEdit = (skill) => {
    setEditingSkillId(skill.id);
    setEditedSkill({
      title: skill.title,
      description: skill.description,
      category: skill.category
    });
  };

  const handleSave = (id) => {
    console.log(editedSkill)
    axios.put(`http://localhost:8080/api/skills/${id}`, editedSkill, {
      headers: {
        'Content-Type': 'application/json'
      }
     
    })
      .then(() => {
        alert('Skill updated successfully!');
        setEditingSkillId(null);
        fetchSkills();
      })
      .catch(error => {
        console.error('There was an error updating the skill!', error);
        alert('Failed to update the skill.');
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedSkill(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Skills List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map(skill => (
          <div key={skill.id} className="bg-white shadow-lg rounded-lg p-4">
            {editingSkillId === skill.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  name="title"
                  value={editedSkill.title}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <textarea
                  name="description"
                  value={editedSkill.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="category"
                  value={editedSkill.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={() => handleSave(skill.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingSkillId(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold">{skill.title}</h3>
                <p>{skill.description}</p>
                <p><strong>Category:</strong> {skill.category}</p>
                <p><strong>Created At:</strong> {new Date(skill.createdAt).toLocaleString()}</p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillList;
