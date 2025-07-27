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

  // Only allow updating certain fields, including image
  const allowed = [
    "name",
    "phoneNumber",
    "title",
    "bio",
    "preferredLanguage",
    "image",
    "expertise",
    "links",
    "experience",
    "languages",
    "availability",
    "isRegistered",
    "education",
    "skills",
    "careerGoals",
    "cvs",
    // add other fields you want to allow
  ];
  const filtered = {};
  for (const key of allowed) {
    if (key in allowedFields) filtered[key] = allowedFields[key];
  }
  return filtered;
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
  fieldsToUpdate.isRegistered = true;

  const user = await User.findByIdAndUpdate(userId, fieldsToUpdate, {
    isRegistered: true,
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

export async function suspendUserService(userId, durationInHours) {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found or has been deleted.");
  }

  const now = new Date();
  if (user.suspendedUntil && user.suspendedUntil > now) {
    throw new Error("User is already suspended.");
  }

  const suspendUntil = new Date(
    now.getTime() + durationInHours * 60 * 60 * 1000
  );

  user.suspended = true;
  user.suspendedUntil = suspendUntil;
  await user.save();

  return { message: `User suspended until ${suspendUntil.toISOString()}` };
}

export async function unsuspendUserService(userId) {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found or has been deleted.");
  }

  if (!user.suspended) {
    throw new Error("User is not suspended.");
  }

  user.suspended = false;
  await user.save();

  return { message: "User unsuspended successfully." };
}

export const setUserRoleService = async (userId, role) => {
  const validRoles = ["student", "mentor"];

  if (!validRoles.includes(role)) {
    throw new Error("Invalid role.");
  }

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found.");

  user.role = role;
  await user.save();

  return user;
};
