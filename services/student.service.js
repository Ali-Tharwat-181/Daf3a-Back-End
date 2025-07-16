import User from "../models/User.js";

export const createStudent = async (userId, body) => {
  const user = await User.findById(userId);
  if (!user || user.role !== "student") {
    throw new Error(
      "Only users with student role can create a student profile"
    );
  }
  if (user.isRegistered) {
    throw new Error("Student already exists for this user");
  }
  Object.assign(user, body, { isRegistered: true });
  await user.save();
  return user;
};

export const getStudentById = async (id) => {
  const student = await User.findOne({ _id: id, role: "student" }).select(
    "-password"
  );
  if (!student) {
    throw new Error("Student not found");
  }
  return student;
};

export const updateStudent = async (id, userId, userRole, updateData) => {
  if (userRole !== "student") {
    throw new Error("Unauthorized: Only students can update their profile");
  }
  const student = await User.findOne({ _id: id, role: "student" });
  if (!student) {
    throw new Error("Student not found");
  }
  Object.assign(student, updateData);
  await student.save();
  return student;
};

export const getStudentCVs = async (id) => {
  const student = await User.findOne({ _id: id, role: "student" }).select(
    "-password"
  );
  if (!student) {
    throw new Error("Student not found");
  }
  return student.cvs;
};
