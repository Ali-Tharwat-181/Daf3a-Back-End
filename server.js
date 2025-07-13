import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { saveMessage } from './services/chat.service.js';

dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Track connected users by userId
const onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Receive and store user ID
    socket.on('register', (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`Registered user ${userId} with socket ${socket.id}`);
    });

    // Handle sending messages
    socket.on('sendMessage', async (data) => {
        const { sender, receiver, text } = data;

        // Save to DB
        const saved = await saveMessage({ sender, receiver, text });

        // Send to receiver if online
        const receiverSocket = onlineUsers.get(receiver);
        if (receiverSocket) {
            io.to(receiverSocket).emit('receiveMessage', saved);
        }

        // Also send back to sender (to update UI immediately)
        socket.emit('receiveMessage', saved);
    });

    // Disconnect
    socket.on('disconnect', () => {
        for (let [userId, sockId] of onlineUsers.entries()) {
            if (sockId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Connect DB and start server
connectDB(MONGO_URI).then(() => {
    server.listen(PORT, () => {
        console.log(`HTTP + WebSocket server running on port ${PORT}`);
    });
});
