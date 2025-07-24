import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { type } from "os";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "mentor", "admin"],
      default: "student",
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    stripeAccountId: { type: String }, // mentor فقط
    stripeCustomerId: { type: String }, // student فقط
    balance: { type: Number, default: 0 },
    image: {
      type: String,
      default:
        "https://ui-avatars.com/api/?name=User&background=eee&color=888&size=160",
    },
    title: String,
    bio: String,
    preferredLanguage: {
      type: [String],
      enum: ["arabic", "english"],
      default: ["english"],
    },
    suspended: { type: Boolean, default: false },
    isRegistered: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    //student
    education: String,
    skills: [String],
    careerGoals: String,
    cvs: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    //mentor
    expertise: [String],
    links: [String],
    experience: String,
    languages: [String],
    availability: [
      {
        date: { type: String }, // e.g., "2025-07-22"
        day: { type: String }, // e.g., "Monday"
        slots: [
          {
            start: String, // e.g., "10:00"
            end: String, // e.g., "10:30"
          },
        ],
      },
    ],
    rating: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate password reset token

userSchema.methods.generatePasswordReset = function () {
  const token = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  return token;
};

const User = mongoose.model("User", userSchema);
export default User;
