// workshop.controller.js
import * as workshopService from "../services/workshop.service.js";

export const getAllWorkshops = async (req, res, next) => {
  try {
    const workshops = await workshopService.getAllWorkshops();
    return res.status(200).json({ success: true, data: workshops });
  } catch (error) {
    next(error);
  }
};

export const createWorkshop = async (req, res, next) => {
  try {
    // Add mentor ID from the authenticated user
    if (req.user.role !== "mentor") {
      return res
        .status(403)
        .json({ success: false, message: "Only mentors can create workshops" });
    }
    const data = {
      ...req.body,
      mentor: req.user._id,
    };
    const workshop = await workshopService.createWorkshop(data);
    return res.status(201).json({ success: true, data: workshop });
  } catch (error) {
    next(error);
  }
};

export const getWorkshopById = async (req, res, next) => {
  try {
    const workshop = await workshopService.getWorkshopById(req.params.id);
    return res.status(200).json({ success: true, data: workshop });
  } catch (error) {
    next(error);
  }
};

export const updateWorkshopById = async (req, res, next) => {
  try {
    const workshop = await workshopService.updateWorkshop(
      req.params.id,
      req.body,
      req.user._id
    );
    return res.status(200).json({ success: true, data: workshop });
  } catch (error) {
    next(error);
  }
};

export const deleteWorkshopById = async (req, res, next) => {
  try {
    await workshopService.deleteWorkshop(req.params.id, req.user._id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const registerToWorkshop = async (req, res, next) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can register for workshops",
      });
    }

    const updatedWorkshop = await workshopService.registerStudentToWorkshop(
      req.params.id,
      req.user._id
    );

    return res.status(200).json({
      success: true,
      data: updatedWorkshop,
      message: "Registered successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMentorWorkshops = async (req, res, next) => {
  try {
    const workshops = await workshopService.getWorkshopsByMentor(req.user._id);
    return res.status(200).json({ success: true, data: workshops });
  } catch (error) {
    next(error);
  }
};
