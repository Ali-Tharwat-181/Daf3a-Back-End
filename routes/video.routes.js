import express from "express";
import { getVideoToken } from "../controllers/videoController.js";
import authMiddleware from "../middlewares/auth.js";

const videoRouter = express.Router();

videoRouter.get("/token/:id", authMiddleware, getVideoToken);

export default videoRouter;
