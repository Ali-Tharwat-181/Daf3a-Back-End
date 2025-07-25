import {
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
  unsuspendUserService,
  suspendUserService,
  setUserRoleService,
} from "../services/user.service.js";

// Get all users (admin only)
export async function getAllUsers(req, res, next) {
  try {
    const result = await getAllUsersService(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

// Get user by ID
export async function getUserById(req, res, next) {
  try {
    const result = await getUserByIdService(req.params.id);
    res.status(200).json({
      success: true,
      user: result.user,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
}

// Update user (admin only)
export async function updateUser(req, res, next) {
  try {
    const result = await updateUserService(req.params.id, req.body, "admin");
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

// Delete user (admin only)
export async function deleteUser(req, res, next) {
  try {
    const result = await deleteUserService(req.params.id);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

// User can update their own profile
export async function updateUserProfile(req, res, next) {
  try {
    const result = await updateUserService(req.user._id, req.body, "user");
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export async function suspendUser(req, res) {
  try {
    const result = await suspendUserService(req.params.id);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// controllers/user.controller.js

export async function unsuspendUser(req, res) {
  try {
    const result = await unsuspendUserService(req.params.id);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export const setUserRole = async (req, res) => {
  try {
    const userId = req.user._id;
    const { role } = req.body;

    if (!role) {
      return res
        .status(400)
        .json({ success: false, message: " Role is required." });
    }

    const updatedUser = await setUserRoleService(userId, role);
    res.status(200).json({
      success: true,
      message: "User role updated.",
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
