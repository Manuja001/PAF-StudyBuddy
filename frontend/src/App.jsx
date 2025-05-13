import React from "react";
import Hero from "./components/Hero";
import Features from "./components/Features";
import About from "./components/About";
import Navbar from "./components/Navbar";
import Contact from "./components/Contact";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <About />
        <Contact />
      </main>
    </div>
  );
}

export default App;
