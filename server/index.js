const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const PORT = 3000;

// ✅ Fix CORS Issues
app.use(
  cors({
    origin: "http://localhost:5173", // Allow React frontend
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // ✅ Join Room
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  // ✅ Send Message to a Room
  socket.on("send_message", ({ room, message }) => {
    io.to(room).emit("receive_message", message);
  });

  // ✅ Handle Disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// ✅ Start Server
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
