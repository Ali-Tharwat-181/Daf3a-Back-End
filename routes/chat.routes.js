
import express from "express";
import {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} from "../controllers/chat.controller.js";
import authMiddleware  from "../middlewares/auth.js";

const chatRouter = express.Router();
chatRouter.post("/", authMiddleware, accessChat);
chatRouter.get("/", authMiddleware, fetchChats);
chatRouter.post("/group", authMiddleware, createGroupChat);
chatRouter.put("/group/rename", authMiddleware, renameGroup);
chatRouter.put("/group/remove", authMiddleware, removeFromGroup);
chatRouter.put("/group/add", authMiddleware, addToGroup);
export default chatRouter;
