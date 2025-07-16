import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expertise: [String],
    title: String,
    bio: String,
    links: [String],
    experience: String,
    languages: [String],
    availability: [{ day: String, slots: [String] }],
    rating: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    mentorImage: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const Mentor = mongoose.model("Mentor", mentorSchema);
export default Mentor;
