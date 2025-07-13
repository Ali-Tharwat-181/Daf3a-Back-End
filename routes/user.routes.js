import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserProfile,
  changePassword,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.js";
import roleCheck from "../middlewares/roleCheck.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllUsers);

router.get("/:id", validateObjectId, getUserById);

router.put("/:id", validateObjectId, roleCheck("admin"), updateUser);

router.delete("/:id", validateObjectId, roleCheck("admin"), deleteUser);

router.put("/profile/update", updateUserProfile);

router.put("/profile/change-password", changePassword);

export default router;
