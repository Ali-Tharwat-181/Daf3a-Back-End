import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { saveMessage } from "./services/chat.service.js";
import { setupMessageSocket } from "./socket/messageSocket.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Track connected users by userId
const onlineUsers = new Map();

setupMessageSocket(io);
// Connect DB and start server
connectDB(MONGO_URI).then(() => {
  server.listen(PORT, () => {
    console.log(`HTTP + WebSocket server running on port ${PORT}`);
  });
});
