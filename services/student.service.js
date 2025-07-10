import Student from "../models/Student.js";

export const getStudentById = async (id) => {
  const student = await Student.findById(id).populate("user", "-password");
  if (!student) {
    throw new Error("Student not found");
  }
  return student;
};

export const updateStudent = async (id, userId, userRole, updateData) => {
  const student = await Student.findById(id);
  if (!student) {
    throw new Error("Student not found");
  }
  if (userRole !== "student" || userId !== student.user._id.toString()) {
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
  return student.cvs;
};
