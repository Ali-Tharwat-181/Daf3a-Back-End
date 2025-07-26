import Workshop from "../models/Workshop.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";

export const getAllWorkshops = async () => {
  return await Workshop.find()
    .populate("mentor")
    .populate("registeredStudents");
};

export const createWorkshop = async (data) => {
  const newWorkshop = new Workshop(data);
  return await newWorkshop.save();
};

export const getWorkshopById = async (id) => {
  return await Workshop.findById(id)
    .populate("mentor")
    .populate("registeredStudents");
};

export const updateWorkshop = async (id, updates, authMentorId) => {
  const workshop = await Workshop.findById(id);
  if (!workshop) throw new Error("Workshop not found");

  // Ensure the user is a mentor
  const mentor = await User.findOne({ _id: authMentorId, role: "mentor" });
  if (!mentor)
    throw new Error("You are not authorized to update this workshop");

  if (workshop.mentor.toString() !== authMentorId.toString()) {
    const err = new Error("You are not authorized to update this workshop");
    err.status = 403;
    throw err;
  }

  Object.assign(workshop, updates); // apply changes
  return await workshop.save();
};

export const deleteWorkshop = async (id, authMentorId) => {
  const workshop = await Workshop.findById(id);
  if (!workshop) throw new Error("Workshop not found");

  if (workshop.mentor.toString() !== authMentorId.toString()) {
    const err = new Error("You are not authorized to delete this workshop");
    err.status = 403;
    throw err;
  }

  return await Workshop.findByIdAndDelete(id);
};

export const registerStudentToWorkshop = async (workshopId, studentId) => {
  const workshop = await Workshop.findById(workshopId).populate("mentor");
  if (!workshop) throw new Error("Workshop not found");

  // Ensure the user is a student
  const student = await User.findOne({ _id: studentId, role: "student" });
  if (!student) throw new Error("User is not a student");

  if (workshop.registeredStudents.includes(studentId)) {
    throw new Error("Student already registered in this workshop");
  }

  if (workshop.registeredStudents.length >= workshop.capacity) {
    throw new Error("Workshop is full");
  }

  //  Add student to the workshop
  workshop.registeredStudents.push(studentId);
  await workshop.save();

  return workshop;
};

//paid student registration to wrkshop
export const registerPaidStudentToWorkshop = async (
  workshopId,
  studentId,
  paymentIntentId
) => {
  const workshop = await Workshop.findById(workshopId).populate("mentor");

  if (!workshop) throw new Error("Workshop not found");

  const student = await User.findOne({ _id: studentId, role: "student" });
  if (!student) throw new Error("User is not a student");

  if (workshop.registeredStudents.includes(studentId)) {
    throw new Error("Student already registered in this workshop");
  }

  if (workshop.registeredStudents.length >= workshop.capacity) {
    throw new Error("Workshop is full");
  }
  const mentor = await User.findById(workshop.mentor);
  if (!mentor) throw new Error("Mentor not found");
  // Register student
  workshop.registeredStudents.push(studentId);

  // Store paymentIntent ID
  if (paymentIntentId) {
    if (!workshop.paymentIntentIds) workshop.paymentIntentIds = [];
    workshop.paymentIntentIds.push(paymentIntentId);
  }
  mentor.balance += workshop.price;

  await mentor.save();
  await workshop.save();

  return workshop;
};


export const getWorkshopsByStudent = async (studentId) => {
  return await Workshop.find({ registeredStudents: studentId }).populate(
    "mentor"
  );
};

export const getWorkshopsByMentor = async (mentorId) => {
  return await Workshop.find({ mentor: mentorId }).populate(
    "registeredStudents title description date time location type price language image rating topic capacity mentor"
  );
};

// Get workshops for any given mentor by ID
export const getWorkshopsByMentorId = async (mentorId) => {
  return await Workshop.find({ mentor: mentorId })
    .populate("registeredStudents")
    .populate("mentor");
};

export const markWorkshopAsCompleted = async (workshopId) => {
  const workshop = await Workshop.findById(workshopId);
  if (!workshop) {
    throw new Error("Workshop not found");
  }

  workshop.status = "completed";
  return await workshop.save();
};
