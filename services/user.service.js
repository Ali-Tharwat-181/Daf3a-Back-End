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
  return { user };
}

function sanitizeUserUpdate(data) {
  const { password, email, mode, role, ...allowedFields } = data;

  if (password || email || mode || role) {
    throw new Error(
      "Password, email, role, and mode cannot be updated through profile update."
    );
  }

  return allowedFields;
}

function sanitizeAdminUpdate(data) {
  const { password, ...allowedFields } = data;

  if (password) {
    throw new Error("Password cannot be updated through this endpoint.");
  }

  return allowedFields;
}

export async function updateUserService(userId, updateData, mode = "user") {
  let fieldsToUpdate;

  if (mode === "admin") {
    fieldsToUpdate = sanitizeAdminUpdate(updateData);
  } else if (mode === "user") {
    fieldsToUpdate = sanitizeUserUpdate(updateData);
  } else {
    throw new Error("Invalid mode. Use 'admin' or 'user'.");
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
