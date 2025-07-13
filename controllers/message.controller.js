import { getMessagesBetweenUsers } from "../services/chat.service.js";

export const getMessagesBetweenUsersController = async (req, res, next) => {
    const { userId, otherUserId } = req.params;

    try {
        const messages = await getMessagesBetweenUsers(userId, otherUserId);
        res.status(200).json({ success: true, data: messages });
    } catch (err) {
        next(err);
    }
};
