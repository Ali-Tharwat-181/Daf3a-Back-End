import express from 'express';
import {
    getAllWorkshops,
    createWorkshop,
    getWorkshopById,
    updateWorkshopById,
    deleteWorkshopById,
    registerToWorkshop,
} from '../controllers/workshop.controller.js';
import authMiddleware from '../middlewares/auth.js';



const workshopRouter = express.Router();

workshopRouter.get('/', getAllWorkshops);
workshopRouter.get('/:id', getWorkshopById);
// Auth-protected routes
workshopRouter.post('/', authMiddleware, createWorkshop);
workshopRouter.patch('/:id', authMiddleware, updateWorkshopById);
workshopRouter.delete('/:id', authMiddleware, deleteWorkshopById);
workshopRouter.post('/:id/register', authMiddleware, registerToWorkshop);

export default workshopRouter;
