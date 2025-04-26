import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "./pages/HomePage";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Post from "./components/Post";
import Comments from "./components/Comments";
import Posts from "./components/Posts";

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
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:postId" element={<Post />} />
        <Route path="/comments/:postId" element={<Comments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
