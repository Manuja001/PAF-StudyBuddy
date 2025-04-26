import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SkillDetails = () => {
  const { id } = useParams();
  const [skill, setSkill] = useState(null);

  useEffect(() => {
    // Fetching skill details by ID
    axios.get(`/api/skills/${id}`)
      .then(response => {
        setSkill(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the post details!', error);
      });
  }, [id]);

  if (!skill) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{skill.title}</h2>
      <p><strong>Description:</strong> {skill.description}</p>
      <p><strong>Category:</strong> {skill.category}</p>
      <p><strong>User ID:</strong> {skill.userId}</p>
      <p><strong>Created At:</strong> {new Date(skill.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default SkillDetails;
