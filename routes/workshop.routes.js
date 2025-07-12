// workshop.routes.js
import express from 'express';
import {
    getAllWorkshops,
    createWorkshop,
    getWorkshopById,
    updateWorkshopById,
    deleteWorkshopById,
    registerToWorkshop,
} from '../controllers/workshop.controller.js';

const workshopRouter = express.Router();

workshopRouter.get('/', getAllWorkshops);
workshopRouter.post('/', createWorkshop);
workshopRouter.get('/:id', getWorkshopById);
workshopRouter.patch('/:id', updateWorkshopById);
workshopRouter.delete('/:id', deleteWorkshopById);
workshopRouter.post('/:id/register', registerToWorkshop);

export default workshopRouter;
