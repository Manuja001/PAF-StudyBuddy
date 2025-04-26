import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CreateSkill from "./components/CreateSkill";
import SkillList from "./components/SkillList";
import SkillDetails from "./components/SkillDetails";
import HomePage from "./pages/HomePage";  // Importing the HomePage component

import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4 text-white flex justify-center gap-6">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/skills" className="hover:underline">View Skills</Link>
          <Link to="/create-skill" className="hover:underline">Create Skill</Link>
        </nav>

        <main className="p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />  {/* Using HomePage component here */}
            <Route path="/skills" element={<SkillList />} />
            <Route path="/create-skill" element={<CreateSkill />} />
            <Route path="/skills/:id" element={<SkillDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
