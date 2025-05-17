import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../config/axios";

function Login() {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchOAuthToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      if (code) {
        try {
          const response = await axios.post("/oauth2/callback/google", { code });
          if (response.status === 200) {
            const token = response.data.token;
            const userId = response.data.id;
            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            toast.success("Login successful!");
            navigate(`/Profile/${userId}`);
          }
        } catch (error) {
          toast.error("Login failed. Please try again.");
        }
      }
    };
    fetchOAuthToken();
  }, [navigate]);

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await axios.post("/api/login", formData);
      if (response.status === 200) {
        const token = response.data.token;
        const userId = response.data.id;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        toast.success("Login successful!");
        navigate(`/profile/${userId}`);
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#393e46]">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl flex flex-col items-center">
        <div className="text-center mb-6">
          <h2 className="text-[#393e46] text-2xl font-bold mb-1">LOG IN</h2>
          <div className="w-12 h-0.5 bg-[#fb5e2e] mx-auto"></div>
          <p className="text-gray-400 text-sm mt-4">Log in to get in the moment updates on the things that interest you.</p>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#fb5e2e]">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 8-4 8-4s8 0 8 4"/></svg>
            </span>
            <input
              className="w-full pl-16 pr-4 py-3 rounded-full bg-white border border-gray-300 focus:border-[#fb5e2e] outline-none text-gray-700 placeholder-gray-400"
              type="email"
              id="email"
              placeholder="USER NAME"
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#fb5e2e]">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="8" rx="4"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/></svg>
            </span>
            <input
              className="w-full pl-16 pr-10 py-3 rounded-full bg-white border border-gray-300 focus:border-[#fb5e2e] outline-none text-gray-700 placeholder-gray-400"
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="PASSWORD"
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#fb5e2e]"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
              ) : (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.77 21.77 0 0 1 5.06-6.06M1 1l22 22"/><path d="M9.53 9.53A3 3 0 0 0 12 15a3 3 0 0 0 2.47-5.47"/></svg>
              )}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-[#fb5e2e] text-white font-bold py-3 rounded-full mt-2 hover:bg-[#ff7f3f] transition-all text-lg tracking-wide"
            disabled={loading}
          >
            {loading ? "Loading..." : "LOGIN"}
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-[#fb5e2e] hover:underline">Sign Up Now</Link>
        </p>
        <div className="w-full mt-6">
          <div className="flex items-center">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-4 text-gray-400 text-xs">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <div className="bg-white rounded-b-2xl py-4 mt-4 flex flex-col items-center">
            <a 
              href="http://localhost:8080/oauth2/authorize/google"
              className="flex items-center justify-center gap-3 w-full max-w-xs px-4 py-2.5 border border-gray-300 rounded-full hover:bg-gray-50 transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-600 font-medium">Continue with Google</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
