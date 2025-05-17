import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import bot from "../assets/bot.png";
import add from "../assets/add.png";
import ProfilePic from "../assets/userProfile.png";
import axios from "../config/axios";
import "./ChatBot.css";

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
    console.log("Input submitted:", input);
    if (!input.trim()) return;

    setChatLog((prev) => [...prev, { user: "me", message: input }]);
    const userMessage = input;
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/chatbot", {
        message: userMessage,
      });
      console.log("Response from server:", response.data);
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
    <div className="chatbot-root">
      {/* Sidebar */}
      <aside className="chatbot-sidebar">
        <div className="chatbot-sidebar-header">
          <h2 className="chatbot-title">AI Assistant</h2>
          <img src={bot} alt="bot" className="chatbot-bot-icon" />
        </div>
        <button onClick={clearChatLog} className="chatbot-newchat-btn">
          New Chat <img src={add} alt="add" className="chatbot-add-icon" />
        </button>
      </aside>

      {/* Chat Area */}
      <section className="chatbot-chat-area">
        {/* Chat Messages */}
        <div ref={chatLogRef} className="chatbot-messages">
          {chatLog.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))}
          {loading && (
            <div className="chatbot-loading">
              <div className="chatbot-dot"></div>
              <div className="chatbot-dot chatbot-dot-delay1"></div>
              <div className="chatbot-dot chatbot-dot-delay2"></div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="chatbot-input-form">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="chatbot-input"
          />
          <button type="submit" className="chatbot-send-btn">
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
      className={`chatbot-message-row ${
        isAI ? "chatbot-message-ai" : "chatbot-message-user"
      }`}
    >
      <div className="chatbot-avatar">
        <img
          src={isAI ? bot : ProfilePic}
          alt="avatar"
          className="chatbot-avatar-img"
        />
      </div>
      <div>
        <div
          className={`chatbot-message-bubble ${
            isAI ? "chatbot-bubble-ai" : "chatbot-bubble-user"
          }`}
        >
          {message.message}
        </div>
        <p className="chatbot-timestamp">{timestamp}</p>
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
