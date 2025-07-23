import express from "express";
import { allMessages, sendMessage } from "../controllers/message.controller.js";
import authMiddleware from "../middlewares/auth.js";

const messageRouter = express.Router();

messageRouter.get("/:chatId", authMiddleware, allMessages);
messageRouter.post("/", authMiddleware, sendMessage);

export default messageRouter;
