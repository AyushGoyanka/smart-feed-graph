import { useState } from "react";

import axios from "axios";

import ReactMarkdown from "react-markdown";

import "../styles/chat.css";

const AIChat = () => {
  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  // SEND MESSAGE
  const sendMessage = async () => {
    if (message.trim() === "")
      return;

    // USER MESSAGE
    const userMessage = {
      sender: "user",

      text: message,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setLoading(true);

    try {
      // API CALL
      const res = await axios.post(
        "http://localhost:5000/chat",
        {
          message,
        }
      );

      // BOT MESSAGE
      const botMessage = {
        sender: "bot",

        text: res.data.reply,
      };

      setMessages((prev) => [
        ...prev,
        botMessage,
      ]);
    } catch (error) {
      console.log(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",

          text: "Something went wrong.",
        },
      ]);
    }

    setMessage("");

    setLoading(false);
  };

  // ENTER KEY SUPPORT
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <h2>AlgoQuest AI</h2>

      {/* CHAT AREA */}
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.sender === "user"
                ? "user-msg"
                : "bot-msg"
            }
          >
            <ReactMarkdown>
              {msg.text}
            </ReactMarkdown>
          </div>
        ))}

        {loading && (
          <div className="bot-msg">
            Thinking...
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask Doubts..."
          value={message}
          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }
          onKeyDown={handleKeyPress}
        />

        <button onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChat;