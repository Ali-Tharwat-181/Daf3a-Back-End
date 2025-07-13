import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserProfile,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.js";
import roleCheck from "../middlewares/roleCheck.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", roleCheck("admin"), getAllUsers);

router.get("/:id", getUserById);

router.put("/:id", roleCheck("admin"), updateUser);

router.delete("/:id", roleCheck("admin"), deleteUser);

router.put("/profile/update", updateUserProfile);

export default router;
