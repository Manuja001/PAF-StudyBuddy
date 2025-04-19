import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "./pages/HomePage";
import Login from "./components/Login";
import Register from "./components/Register";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
