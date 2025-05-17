import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Navbar from "./components/Navbar";
import CreateStudyPlan from "./components/CreateStudyPlan";
import ViewStudyPlan from "./components/ViewStudyPlan";
import StudyPlanList from "./components/StudyPlanList";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      {/* <Header /> */}
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:postId" element={<Post />} />
        <Route path="/comments/:postId" element={<Comments />} />
        <Route path="/Profile/:id" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/chatBot" element={<ChatBot />} />
        <Route path="/study-plan" element={<CreateStudyPlan />} />
        <Route path="/view-study-plan" element={<StudyPlanList />} />
        <Route path="/view-study-plan/:id" element={<ViewStudyPlan />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
