import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import Features from "./components/Features";
import About from "./components/About";
import Navbar from "./components/Navbar";
import Contact from "./components/Contact";
import CreateStudyPlan from "./components/CreateStudyPlan";
import ViewStudyPlan from "./components/ViewStudyPlan";

function HomePage() {
  return (
    <main>
      <Hero />
      <Features />
      <About />
      <Contact />
    </main>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/study-plan" element={<CreateStudyPlan />} />
          <Route path="/view-study-plan" element={<ViewStudyPlan />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
