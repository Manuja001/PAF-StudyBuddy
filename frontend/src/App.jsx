import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "./pages/HomePage";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import CreatePost from "./components/CreatePost";
import Post from "./components/Post";
import Comments from "./components/Comments";
import Posts from "./components/Posts";
import Admin from "./components/Admin";
import ChatBot from "./components/ChatBot";
import Hero from "./components/Hero";
import Features from "./components/Features";
import About from "./components/About";
import Navbar from "./components/Navbar";
import Contact from "./components/Contact";
import CreateStudyPlan from "./components/CreateStudyPlan";
import ViewStudyPlan from "./components/ViewStudyPlan";
import StudyPlanList from "./components/StudyPlanList";

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
    <BrowserRouter>
      {/* <Header /> */}
      {/* <ToastContainer /> */}
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:postId" element={<Post />} />
          <Route path="/comments/:postId" element={<Comments />} />
          <Route path="/Profile/:id" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/chatBot" element={<ChatBot />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/study-plan" element={<CreateStudyPlan />} />
          <Route path="/view-study-plan" element={<StudyPlanList />} />
          <Route path="/view-study-plan/:id" element={<ViewStudyPlan />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
