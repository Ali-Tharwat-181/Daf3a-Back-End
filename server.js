import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import express from "express";

dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Initialize Socket.IO
const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*", // Adjust this to your frontend URL
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (data) => {
    console.log("Typing event received:", data);
    socket.to(data.room).emit("typing", {
      user: data.user,
      userName: data.userName,
      room: data.room
    });
  });

  socket.on("stop typing", (data) => {
    console.log("Stop typing event received:", data);
    socket.to(data.room).emit("stop typing", {
      user: data.user,
      userName: data.userName,
      room: data.room
    });
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      
      // Emit message to all users except sender
      socket.in(user._id).emit("message received", newMessageRecieved);

      // Check if user is NOT in the chat room, then emit notification
      const roomSockets = io.sockets.adapter.rooms.get(chat._id);
      const userSocketId = Array.from(io.sockets.sockets).find(([id, s]) =>
        s.rooms.has(user._id)
      )?.[0];

      if (!roomSockets || !userSocketId || !roomSockets.has(userSocketId)) {
        // User is not in the chat room, send notification
        socket
          .in(user._id)
          .emit("notification", { 
            chat: chat, 
            message: newMessageRecieved 
          });
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });
});

// Connect DB and start server
connectDB(MONGO_URI);