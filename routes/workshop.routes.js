import express from "express";
import {
  getAllWorkshops,
  createWorkshop,
  getWorkshopById,
  updateWorkshopById,
  deleteWorkshopById,
  registerToWorkshop,
  getMentorWorkshops,
  getWorkshopsForMentor,
  markWorkshopAsCompleted,
  registerPaidWorkshopController,
} from "../controllers/workshop.controller.js";
import authMiddleware from "../middlewares/auth.js";

const workshopRouter = express.Router();

// All workshops
workshopRouter.get("/", getAllWorkshops);

// Get workshop by ID
workshopRouter.get("/:id", getWorkshopById);

// Create workshop (mentor only)
workshopRouter.post("/", authMiddleware, createWorkshop);

// Get workshops of the logged-in mentor
workshopRouter.get("/me/mentor/:mentorId", authMiddleware, getMentorWorkshops);

//  Get workshops by any mentor (public)
workshopRouter.get("/mentor/:mentorId", getWorkshopsForMentor);

// Update/delete/register (auth required)
workshopRouter.patch("/:id", authMiddleware, updateWorkshopById);
workshopRouter.delete("/:id", authMiddleware, deleteWorkshopById);
workshopRouter.post("/:id/register", authMiddleware, registerToWorkshop);
workshopRouter.post("/paid-register", authMiddleware, registerPaidWorkshopController);

workshopRouter.patch("/:id/completed", authMiddleware, markWorkshopAsCompleted);

export default workshopRouter;
