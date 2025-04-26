import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "./pages/HomePage";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Post from "./components/Post";
import Comments from "./components/Comments";
import Posts from "./components/Posts";
import axios from 'axios';

function App() {
  
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYW51amFzYW5kZWVwQGdtYWlsLmNvbSIsImlhdCI6MTc0NTYzNTA0NSwiZXhwIjoxNzQ1NjcxMDQ1fQ.4WxmSx_K50hdrDdwdU0uQPco0v_edMpKE-ITgHGpRgI";

  
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  axios.defaults.baseURL = 'http://localhost:8080'; 
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
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:postId" element={<Post />} />
        <Route path="/comments/:postId" element={<Comments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
