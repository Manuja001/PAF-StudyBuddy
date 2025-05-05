import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "./pages/HomePage";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import CreatePost from './components/CreatePost';
import Post from "./components/Post";
import Comments from "./components/Comments";
import Posts from "./components/Posts";
import axios from 'axios';

function App() {
  
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYW51amFzYW5kZWVwQGdtYWlsLmNvbSIsImlhdCI6MTc0NjQxOTQ5MywiZXhwIjoxNzQ2NDU1NDkzfQ.hSxBKlArkNujuosBzFTEBudb_vw71VKlWD4oi2jFGNM";

  
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
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:postId" element={<Post />} />
        <Route path="/comments/:postId" element={<Comments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
