import User from "../models/User.js";

// Get all users with pagination and filtering
export async function getAllUsersService(query) {
  const { page = 1, limit = 10, role, search } = query;
  const skip = (page - 1) * limit;

  let filter = {};

  if (role) {
    filter.role = role;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(filter)
    .select("-password")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(filter);

  return {
    users,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
}

export async function getUserByIdService(userId) {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found.");
  }
  // Find related student and mentor profiles
  const Student = (await import("../models/Student.js")).default;
  const Mentor = (await import("../models/Mentor.js")).default;
  const student = await Student.findOne({ user: userId });
  const mentor = await Mentor.findOne({ user: userId });
  return {
    user,
    studentId: student ? student._id : null,
    mentorId: mentor ? mentor._id : null,
  };
}

export async function updateUserService(userId, updateData, role = "user") {
  let fieldsToUpdate;

  if (role === "admin") {
    const { password, ...otherFields } = updateData;

    if (password) {
      throw new Error("Password cannot be updated through this endpoint.");
    }
    fieldsToUpdate = otherFields;
  } else if (role === "user") {
    const { password, email, role, ...allowedFields } = updateData;

    if (password || email || role) {
      throw new Error(
        "Password, email, and role cannot be updated through profile update."
      );
    }
    fieldsToUpdate = allowedFields;
  } else {
    throw new Error("Invalid role. Use 'admin' or 'user'.");
  }

  const user = await User.findByIdAndUpdate(userId, fieldsToUpdate, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    throw new Error("User not found.");
  }

  return { user };
}

export async function deleteUserService(userId) {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new Error("User not found.");
  }
  return { message: "User deleted successfully." };
}
