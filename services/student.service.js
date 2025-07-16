import Student from "../models/Student.js";
import User from "../models/User.js";

export const createStudent = async (userId, body) => {
  // Check if the student profile already exists for this user
  const existingStudent = await Student.findOne({ user: userId });
  if (existingStudent) {
    throw new Error("Student already exists for this user");
  }

  // Create the student profile
  const newStudent = await Student.create({ user: userId, ...body });

  await User.findByIdAndUpdate(userId, { isRegistered: true }, { new: true });

  return newStudent;
};

export const getStudentById = async (id) => {
  const student = await Student.findById(id).populate("user", "-password");

  if (!student) {
    throw new Error("Student not found");
  }

  //  Check if associated user has role "student"
  if (!student.user || student.user.role !== "student") {
    throw new Error("User is not a student");
  }

  return student;
};

export const updateStudent = async (id, userId, userRole, updateData) => {
  const student = await Student.findById(id);
  if (!student) {
    throw new Error("Student not found");
  }
  if (userRole !== "student") {
    throw new Error("Unauthorized: Only students can update their profile");
  }
  Object.assign(student, updateData);
  await student.save();
  return student;
};

export const getStudentCVs = async (id) => {
  const student = await Student.findById(id).populate("user", "-password");

  if (!student) {
    throw new Error("Student not found");
  }

  if (!student.user || student.user.role !== "student") {
    throw new Error("User is not a student");
  }

  return student.cvs;
};
