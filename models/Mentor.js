import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    expertise: [String],
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

module.exports = mongoose.model("Mentor", mentorSchema);
