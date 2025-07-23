import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema({
  roomName: { type: String, required: true },
  identity: { type: String, required: true, unique: true },
  tokenUsed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Invite = mongoose.model("Invite", inviteSchema);
export default Invite;
