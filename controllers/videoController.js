import Workshop from "../models/Workshop.js";
import Booking from "../models/Booking.js";
import { generateLivekitToken } from "../services/generateToken.js";

export const getVideoToken = async (req, res) => {
  try {
    const { type = "workshop" } = req.query;
    const id = req.params.id;
    const userId = req.user._id.toString();
    const userName = req.user.name;

    let session;
    let isMentor = false;
    let isStudent = false;
    let roomName;
    let startTime;
    let durationMinutes;

    if (type === "booking") {
      session = await Booking.findById(id).populate("mentor student").lean();
      if (!session)
        return res.status(404).json({ message: "Booking not found" });

      isMentor = session.mentor._id.toString() === userId;
      isStudent = session.student._id.toString() === userId;
      if (!isMentor && !isStudent)
        return res.status(403).json({ message: "Access denied" });

      roomName = `booking-${id}`;
      const datePart = new Date(session.date).toISOString().split("T")[0];
      startTime = new Date(`${datePart}T${session.timeSlot[0].start}:00`);
      durationMinutes = 60;
    } else {
      session = await Workshop.findById(id)
        .populate("mentor registeredStudents")
        .lean();
      if (!session)
        return res.status(404).json({ message: "Workshop not found" });

      isMentor = session.mentor._id.toString() === userId;
      isStudent = session.registeredStudents.some(
        (id) => id.toString() === userId
      );
      if (!isMentor && !isStudent)
        return res.status(403).json({ message: "Access denied" });

      roomName = `workshop-${id}`;
      const datePart = new Date(session.date).toISOString().split("T")[0];
      startTime = new Date(`${datePart}T${session.time}:00`);
      durationMinutes = parseInt(session.duration) || 60;
    }

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
