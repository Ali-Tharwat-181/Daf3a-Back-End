import User from "../models/User.js";
import Review from "./../models/Review.js";

export const getMentors = async () => {
  const mentors = await User.find({ role: "mentor" }).select("-password");
  return mentors;
};

export const getMentorById = async (id, user) => {
  const dbUser = await User.findById(user?._id);
  if (!dbUser || dbUser.role !== "mentor") {
    throw new Error("Unauthorized: Only mentors can access this resource");
  }

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

// add slots to availability
export const addAvailabilitySlot = async (mentorId, day, slots) => {
  const mentor = await User.findOne({ _id: mentorId, role: "mentor" });
  if (!mentor) throw new Error("Mentor not found");

  const dayAvailability = mentor.availability.find((av) => av.day === day);

  if (dayAvailability) {
    slots.forEach((slot) => {
      if (!dayAvailability.slots.includes(slot)) {
        dayAvailability.slots.push(slot);
      }
    });
  } else {
    mentor.availability.push({ day, slots });
  }

  await mentor.save();
  return mentor.availability;
};

//Remove Slots from Availability

export const removeAvailabilitySlot = async (mentorId, day, slots) => {
  const mentor = await User.findOne({ _id: mentorId, role: "mentor" });
  if (!mentor) throw new Error("Mentor not found");

  const dayAvailability = mentor.availability.find((av) => av.day === day);
  if (!dayAvailability) throw new Error("No availability found for this day");

  dayAvailability.slots = dayAvailability.slots.filter(
    (s) => !slots.includes(s)
  );

  if (dayAvailability.slots.length === 0) {
    mentor.availability = mentor.availability.filter((av) => av.day !== day);
  }

  await mentor.save();
  return mentor.availability;
};
