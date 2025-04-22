import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dmpopup = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketId, setSocketId] = useState("");
  const navigate = useNavigate();

  // Fetch messages from the server on component mount
  useEffect(() => {
    axios
      .get("http://localhost:3000/profile/chats/getMessages")
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error("Error fetching messages: ", error);
      });

    socket.on("message", (data) => {
      setSocketId(socket.id);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = { sender: socketId, content: message };
      socket.emit("message", newMessage);

      axios
        .post("http://localhost:3000/sendMessage", { sender: socketId, content: message })
        .then((response) => {
          setMessages((prev) => [...prev, response.data]);
        })
        .catch((error) => {
          console.error("Error sending message: ", error);
        });

      setMessage("");
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-screen h-screen bg-[#1E2124] text-white">
      
      {/* Sidebar for Chats */}
      <div className="md:w-1/3 w-full h-full p-4 bg-[#2C2F33] border-r border-gray-600 flex flex-col">
        <button
          className="text-gray-300 font-semibold mb-4 hover:text-white transition"
          onClick={() => navigate("/profile/confessions")}
        >
          ← Back to Home
        </button>

        {/* Chat List */}
        <div className="flex flex-col gap-3 overflow-y-auto flex-grow">
          {/* Dummy users */}
          {["User 1", "User 2", "User 3"].map((user, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition"
            >
              <div className="w-12 h-12 bg-gray-500 rounded-full"></div>
              <div>
                <h3 className="font-medium">{user}</h3>
                <p className="text-sm text-gray-400">Last message...</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex flex-col w-full h-full bg-[#36393F] p-4">
        
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-t-lg">
          <h2 className="text-lg font-semibold">Username</h2>
          <button className="text-gray-300 hover:text-white">⋮</button>
        </div>

        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto p-4 space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-xs px-3 py-2 rounded-lg ${
                msg.sender === socketId ? "bg-green-500 ml-auto" : "bg-gray-700"
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-b-lg">
          <input
            type="text"
            className="flex-grow p-2 bg-gray-700 rounded-lg outline-none text-white"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage} className="bg-green-500 px-4 py-2 rounded-lg">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dmpopup;
