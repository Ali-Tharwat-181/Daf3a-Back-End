import Message from '../models/Message.js';

export const saveMessage = async (data) => {
    const message = new Message(data);
    return await message.save();
};

export const getMessagesBetweenUsers = async (user1Id, user2Id) => {
    return await Message.find({
        $or: [
            { sender: user1Id, receiver: user2Id },
            { sender: user2Id, receiver: user1Id }
        ]
    }).sort({ timestamp: 1 }).populate('sender receiver');
};
