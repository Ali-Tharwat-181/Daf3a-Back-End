import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserProfile,
  suspendUser,
  unsuspendUser,
  setUserRole,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.js";
import roleCheck from "../middlewares/roleCheck.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", roleCheck("admin"), getAllUsers);

router.get("/:id", getUserById);

router.put("/:id", roleCheck("admin"), updateUser);

router.delete("/:id", roleCheck("admin"), deleteUser);

router.put("/profile/update", upload.single("image"), updateUserProfile);

router.patch("/:id/suspend", suspendUser);
router.patch("/:id/unsuspend", unsuspendUser);

router.post("/set-role", setUserRole);

export default router;
