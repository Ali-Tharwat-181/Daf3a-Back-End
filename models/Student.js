import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: String,
  bio: String,
  education: String,
  skills: [String],
  careerGoals: String,
  cvs: [String],
  studentImage: { type: String, default: "" },
});

const Student = mongoose.model("Student", studentSchema);
export default Student;
