import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "./pages/HomePage";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
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
        <Route path="/Profile/:id" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/chatBot" element={<ChatBot />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
