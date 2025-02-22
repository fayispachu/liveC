import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function Chat() {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  const joinRoom = () => {
    if (room.trim()) {
      socket.emit("join_room", room);
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send_message", { room, message });
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Private Chat Rooms</h1>

      {!joined ? (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Room Name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="p-2 bg-gray-700 rounded-l focus:outline-none"
          />
          <button
            onClick={joinRoom}
            className="px-4 py-2 bg-blue-500 rounded-r hover:bg-blue-600"
          >
            Join
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold">Room: {room}</h2>
          <div className="h-64 overflow-y-auto p-2 border-b border-gray-600 mb-2">
            {messages.map((msg, i) => (
              <p key={i} className="text-sm p-1 bg-gray-700 rounded mb-1">
                {msg}
              </p>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 rounded-l bg-gray-700 text-white border border-gray-600 focus:outline-none"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-500 rounded-r hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
