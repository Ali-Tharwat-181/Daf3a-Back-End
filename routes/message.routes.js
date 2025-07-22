import express from "express";
import {
  getMessagesBetweenUsersController,
  getMessagesReceivedByUserController,
} from "../controllers/message.controller.js";
import authMiddleware from "../middlewares/auth.js";

const messageRouter = express.Router();

// Get chat messages between logged-in user and another user
messageRouter.get(
  "/:userId/:otherUserId",
  authMiddleware,
  getMessagesBetweenUsersController
);

messageRouter.get(
  "/received/:userId",
  authMiddleware,
  getMessagesReceivedByUserController
);

export default messageRouter;
