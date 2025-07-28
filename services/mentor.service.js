import User from "../models/User.js";
import Review from "./../models/Review.js";

export const getMentors = async () => {
  const mentors = await User.find({ role: "mentor" }).select("-password");
  return mentors;
};

export const getMentorById = async (id, user) => {
  const mentor = await User.findOne({ _id: id, role: "mentor" }).select(
    "-password"
  );
  if (!mentor) {
    throw new Error("Mentor not found");
  }
  const reviews = await Review.find({ targetType: "mentor", targetId: id });
  if (reviews.length > 0) {
    const avgRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    mentor.rating = avgRating.toFixed(1);
  }

  return mentor;
};

export const createMentor = async (userId, body) => {
  const user = await User.findById(userId);
  if (!user || user.role !== "mentor") {
    throw new Error("Only users with mentor role can create a mentor profile");
  }
  if (user.isRegistered) {
    throw new Error("Mentor already exists for this user");
  }
  Object.assign(user, body, { isRegistered: true });
  await user.save();
  return user;
};

export const updateMentor = async (id, userId, userRole, body) => {
  const user = await User.findById(userId);
  if (!user || user.role !== "mentor") {
    throw new Error("Only users with mentor role can update a mentor profile");
  }
  const mentor = await User.findOne({ _id: id, role: "mentor" });
  if (!mentor) {
    throw new Error("Mentor not found");
  }
  Object.assign(mentor, body);
  await mentor.save();
  return mentor;
};

// Add availability slot(s)
export const addAvailabilitySlot = async (mentorId, day, date, slots) => {
  const mentor = await User.findOne({ _id: mentorId, role: "mentor" });
  if (!mentor) throw new Error("Mentor not found");

  const existingAvailability = mentor.availability.find(
    (av) => av.date === date
  );

  if (existingAvailability) {
    slots.forEach((slot) => {
      const exists = existingAvailability.slots.some(
        (s) => s.start === slot.start && s.end === slot.end
      );
      if (!exists) {
        existingAvailability.slots.push(slot);
      }
    });
  } else {
    mentor.availability.push({ date, day, slots });
  }

  await mentor.save();
  return mentor.availability;
};

// Remove availability slot(s)
export const removeAvailabilitySlot = async (mentorId, day, date, slots) => {
  const mentor = await User.findOne({ _id: mentorId, role: "mentor" });
  if (!mentor) throw new Error("Mentor not found");

  const dayAvailability = mentor.availability.find((av) => av.date === date);
  if (!dayAvailability) throw new Error("No availability found for this date");

  dayAvailability.slots = dayAvailability.slots.filter(
    (existingSlot) =>
      !slots.some(
        (slotToRemove) =>
          slotToRemove.start === existingSlot.start &&
          slotToRemove.end === existingSlot.end
      )
  );

  // Remove the whole day if no slots left
  if (dayAvailability.slots.length === 0) {
    mentor.availability = mentor.availability.filter((av) => av.date !== date);
  }

  await mentor.save();
  return mentor.availability;
};

// Get availability
export const getMentorAvailability = async (mentorId) => {
  const mentor = await User.findOne({ _id: mentorId, role: "mentor" });
  if (!mentor) throw new Error("Mentor not found");

  const today = new Date().toISOString().split("T")[0]; // e.g. "2025-07-26"

  // Remove all past availability
  mentor.availability = mentor.availability.filter((av) => av.date >= today);

  await mentor.save(); // save updated availability without past dates

  return mentor.availability;
};

// export const getMentorAvailabilityMentorService = async (mentorId) => {
//   const mentor = await User.findOne({ _id: mentorId });
//   if (!mentor) throw new Error("Mentor not found");

//   // Get tomorrow's date in YYYY-MM-DD format
//   const tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);
//   const tomorrowStr = tomorrow.toISOString().split("T")[0]; // e.g. "2025-07-28"

//   // Filter out availability before tomorrow
//   mentor.availability = mentor.availability.filter((av) => av.date >= tomorrowStr);

//   await mentor.save(); // Save updated availability

//   return mentor.availability;
// };

import dayjs from "dayjs";

export const getMentorAvailabilityMentorService = async (mentorId) => {
  const mentor = await User.findOne({ _id: mentorId });
  if (!mentor) throw new Error("Mentor not found");

  const now = dayjs(); // current date and time
  const todayStr = now.format("YYYY-MM-DD");

  // Filter mentor availability
  mentor.availability = mentor.availability
    .filter((av) => {
      if (av.date < todayStr) {
        // ❌ remove yesterday and any day before
        return false;
      }

      if (av.date === todayStr) {
        // ✅ keep today, but remove past time slots
        const updatedSlots = av.slots.filter((slot) => {
          const slotTime = dayjs(`${av.date} ${slot.start}`);
          return slotTime.isAfter(now);
        });

        // if no slots remain for today, remove the whole day
        if (updatedSlots.length === 0) {
          return false;
        }

        // update the slots
        av.slots = updatedSlots;
        return true;
      }

      // ✅ keep future dates as they are
      return true;
    });

  await mentor.save(); // Save updated availability

  return mentor.availability;
};

export const setMentorPrice = async (mentorId, price) => {
  if (typeof price !== "number" || price < 0) {
    throw new Error("Invalid price");
  }

  const mentor = await User.findOne({ _id: mentorId, role: "mentor" });
  if (!mentor) throw new Error("Mentor not found");

  mentor.price = price;
  await mentor.save();

  return mentor;
};
