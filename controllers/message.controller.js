import {
  getMessagesBetweenUsers,
  getMessagesReceivedByMentor,
} from "../services/chat.service.js";

export const getMessagesBetweenUsersController = async (req, res, next) => {
  const { userId, otherUserId } = req.params;

  try {
    const messages = await getMessagesBetweenUsers(userId, otherUserId);
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
};

export const getMessagesReceivedByMentorController = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const messages = await getMessagesReceivedByMentor(userId);
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch messages" });
  }
};
