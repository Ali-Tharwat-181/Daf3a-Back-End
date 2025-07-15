import {
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
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
      studentId: result.studentId,
      mentorId: result.mentorId,
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
