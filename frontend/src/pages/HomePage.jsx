import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import About from "../components/About";
import Contact from "../components/Contact";

function HomePage() {
  return (
    <div>
      <Hero />
      <Features />
      <About />
      <Contact />
    </div>
  );
}

export default HomePage;
