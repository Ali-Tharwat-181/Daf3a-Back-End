// workshop.service.js
import Workshop from '../models/Workshop.js';

export const getAllWorkshops = async () => {
    return await Workshop.find().populate('mentor registeredStudents');
};

export const createWorkshop = async (data) => {
    const newWorkshop = new Workshop(data);
    return await newWorkshop.save();
};

export const getWorkshopById = async (id) => {
    return await Workshop.findById(id).populate('mentor registeredStudents');
};

export const updateWorkshop = async (id, updates) => {
    return await Workshop.findByIdAndUpdate(id, updates, { new: true });
};

export const deleteWorkshop = async (id) => {
    return await Workshop.findByIdAndDelete(id);
};

import Workshop from '../models/Workshop.js';

export const registerStudentToWorkshop = async (workshopId, studentId) => {
    const workshop = await Workshop.findById(workshopId);

    if (!workshop) throw new Error('Workshop not found');


    if (workshop.registeredStudents.includes(studentId)) {
        throw new Error('Student already registered in this workshop');
    }

    if (workshop.registeredStudents.length >= workshop.capacity) {
        throw new Error('Workshop is full');
    }

    workshop.registeredStudents.push(studentId);
    return await workshop.save();
};
