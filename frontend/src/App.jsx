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

function App() {
  return (
    <BrowserRouter>
      {/* <Header /> */}
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
