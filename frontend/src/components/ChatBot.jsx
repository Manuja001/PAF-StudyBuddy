import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import bot from "../assets/bot.png";
import add from "../assets/add.png";
import ProfilePic from "../assets/userProfile.png";
import axios from "../config/axios";

function ChatBot() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([
    { user: "ai", message: "Hi! How can I assist you today?" },
  ]);
  const [loading, setLoading] = useState(false);
  const chatLogRef = useRef(null);

  useEffect(() => {
    const savedChatLog = JSON.parse(localStorage.getItem("chatLog"));
    if (savedChatLog) {
      setChatLog(savedChatLog);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatLog", JSON.stringify(chatLog));
  }, [chatLog]);

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [chatLog]);

  const clearChatLog = () => setChatLog([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setChatLog((prev) => [...prev, { user: "me", message: input }]);
    const userMessage = input;
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/chatbot", {
        message: userMessage,
      });

      setChatLog((prev) => [
        ...prev,
        { user: "ai", message: response.data.message },
      ]);
    } catch (error) {
      setChatLog((prev) => [
        ...prev,
        { user: "ai", message: "Sorry, I couldn't process your request." },
      ]);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-800 text-white">
      {/* Sidebar */}
      <aside className="w-full md:w-1/3 lg:w-1/4 bg-blue-950 p-4 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-white pb-4 mb-4">
          <h2 className="text-lg font-bold">AI Assistant</h2>
          <img src={bot} alt="bot" className="w-6 h-6" />
        </div>

        {/* New Chat Button */}
        <button
          onClick={clearChatLog}
          className="flex items-center justify-between bg-blue-900 border border-white w-full py-2 px-4 rounded-lg hover:bg-white hover:text-blue-900 transition font-semibold"
        >
          New Chat <img src={add} alt="add" className="w-5 h-5 ml-2" />
        </button>
      </aside>

      {/* Chat Area */}
      <section className="flex-1 flex flex-col bg-gray-900 relative">
        {/* Chat Messages */}
        <div ref={chatLogRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatLog.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))}
          {loading && (
            <div className="flex items-center space-x-2 text-gray-400">
              <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse delay-200"></div>
              <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse delay-400"></div>
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-gray-700 p-4 border-t border-gray-600"
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 rounded-md bg-gray-600 text-white placeholder-gray-300 focus:outline-none"
          />
          <button
            type="submit"
            className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition"
          >
            Send
          </button>
        </form>
      </section>
    </div>
  );
}

const ChatMessage = ({ message }) => {
  const isAI = message.user === "ai";
  const timestamp = new Date().toLocaleTimeString();

  return (
    <div
      className={`flex items-start space-x-4 max-w-3xl mx-auto ${
        isAI ? "justify-start" : "justify-end"
      }`}
    >
      <div className="w-10 h-10">
        <img
          src={isAI ? bot : ProfilePic}
          alt="avatar"
          className="rounded-full w-full h-full object-cover"
        />
      </div>
      <div>
        <div
          className={`p-3 rounded-lg text-white ${
            isAI ? "bg-blue-800" : "bg-green-700"
          }`}
        >
          {message.message}
        </div>
        <p className="text-xs text-gray-400 mt-1">{timestamp}</p>
      </div>
    </div>
  );
};
ChatMessage.propTypes = {
  message: PropTypes.shape({
    user: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }).isRequired,
};

export default ChatBot;
