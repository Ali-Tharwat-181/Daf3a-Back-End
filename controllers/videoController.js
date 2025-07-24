import Workshop from "../models/Workshop.js";
import { generateLivekitToken } from "../services/generateToken.js";

export const getVideoToken = async (req, res) => {
  try {
    const { workshopId } = req.params;
    const userId = req.user._id.toString();
    const userName = req.user.name;

    const workshop = await Workshop.findById(workshopId).lean();
    if (!workshop)
      return res.status(404).json({ message: "Workshop not found" });

    const isMentor = userId === workshop.mentor._id.toString();
    const isStudent = workshop.registeredStudents.some(
      (id) => id.toString() === userId
    );

    if (!isMentor && !isStudent) {
      return res.status(403).json({ message: "Access denied" });
    }

    const roomName = `workshop-${workshopId}`;

    const durationMinutes = parseInt(workshop.duration) || 60;
    const datePart = new Date(workshop.date).toISOString().split("T")[0];
    const startTime = new Date(`${datePart}T${workshop.time}:00`);

    const expirationSeconds = Math.floor(
      (startTime.getTime() + durationMinutes * 60000 - Date.now()) / 1000
    );

    if (expirationSeconds <= 0) {
      return res.status(400).json({ message: "Session has ended" });
    }

    const token = await generateLivekitToken({
      identity: userId,
      name: userName,
      roomName,
      expiration: expirationSeconds,
      isMentor,
    });

    return res.json({ token });
  } catch (err) {
    console.error("Token Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
