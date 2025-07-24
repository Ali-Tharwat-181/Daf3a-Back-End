// import Message from "../models/Message.js";
// import mongoose from "mongoose";

// export const saveMessage = async (data) => {
//   const message = new Message(data);
//   return await message.save();
// };

// export const getMessagesBetweenUsers = async (user1Id, user2Id) => {
//   return await Message.find({
//     $or: [
//       { sender: user1Id, receiver: user2Id },
//       { sender: user2Id, receiver: user1Id },
//     ],
//   })
//     .sort({ timestamp: 1 })
//     .populate("sender receiver");
// };

// export const getUserChats = async (userId) => {
//   const objectId = new mongoose.Types.ObjectId(userId);

//   const chats = await Message.aggregate([
//     {
//       $match: {
//         $or: [{ sender: objectId }, { receiver: objectId }],
//       },
//     },
//     { $sort: { createdAt: -1 } },
//     {
//       $group: {
//         _id: {
//           $cond: [
//             { $gt: ["$sender", "$receiver"] },
//             { sender: "$receiver", receiver: "$sender" },
//             { sender: "$sender", receiver: "$receiver" },
//           ],
//         },
//         lastMessage: { $first: "$$ROOT" },
//       },
//     },
//     { $replaceWith: "$lastMessage" },
//     {
//       $lookup: {
//         from: "users",
//         localField: "sender",
//         foreignField: "_id",
//         as: "sender",
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "receiver",
//         foreignField: "_id",
//         as: "receiver",
//       },
//     },
//     {
//       $project: {
//         text: 1,
//         timestamp: 1,
//         sender: { $arrayElemAt: ["$sender", 0] },
//         receiver: { $arrayElemAt: ["$receiver", 0] },
//       },
//     },
//   ]);

//   return chats;
// };

// export const createChatIfNotExists = async (user1, user2) => {
//   let chat = await Message.findOne({
//     members: { $all: [user1, user2] },
//   });

//   if (!Message) {
//     Message = await Message.create({ members: [user1, user2] });
//   }

//   return Message;
// };