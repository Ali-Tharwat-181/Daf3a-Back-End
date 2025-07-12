// workshop.controller.js
import * as workshopService from '../services/workshop.service.js';

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
        const workshop = await workshopService.createWorkshop(req.body);
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
        const workshop = await workshopService.updateWorkshop(req.params.id, req.body);
        return res.status(200).json({ success: true, data: workshop });
    } catch (error) {
        next(error);
    }
};

export const deleteWorkshopById = async (req, res, next) => {
    try {
        await workshopService.deleteWorkshop(req.params.id);
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const registerToWorkshop = async (req, res, next) => {
    try {
        const updatedWorkshop = await workshopService.registerStudentToWorkshop(
            req.params.id,
            req.body.studentId
        );

        return res.status(200).json({
            success: true,
            data: updatedWorkshop,
            message: 'Registered successfully',
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
