// import { saveMessage } from "../services/chat.service.js";

// export const setupMessageSocket = (io) => {
//   io.on("connection", (socket) => {
//     console.log("New user connected");

//     socket.on("sendMessage", async ({ sender, receiver, text }) => {
//       try {
//         const saved = await saveMessage({ sender, receiver, text });

//         // Send message to receiver if online
//         io.to(receiver).emit("receiveMessage", saved);
//       } catch (error) {
//         console.error("Error saving message:", error.message);
//       }
//     });

//     socket.on("join", (userId) => {
//       socket.join(userId);
//       console.log(`User ${userId} joined their room`);
//     });
//   });
// };
