import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String },
    type: { type: String, enum: ["online", "offline"], required: true },
    price: Number,
    language: String,
    rating: { type: Number, default: 0 },
    topic: {
      type: String,
      enum: [
        "Technical",
        "Business",
        "Design",
        "Marketing",
        "Finance",
        "Healthcare",
        "Education",
        "Career Development",
        "Entrepreneurship",
        "Soft Skills",
      ],
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    capacity: { type: Number, default: 10 },
    registeredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Workshop = mongoose.model("Workshop", workshopSchema);
export default Workshop;
