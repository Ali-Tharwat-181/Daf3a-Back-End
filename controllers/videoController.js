import Workshop from "../models/Workshop.js";
import Booking from "../models/Booking.js";
import { generateLivekitToken } from "../services/generateToken.js";

export const getVideoToken = async (req, res) => {
  const { type = "workshop" } = req.query;
  const { id } = req.params;
  const userName = req.user.name;
  const userId = req.user._id.toString();
  if (type == "workshop") {
    try {
      const workshop = await Workshop.findById(id).lean();
      if (!workshop)
        return res.status(404).json({ message: "Workshop not found" });

      const isMentor = userId === workshop.mentor._id.toString();
      const isStudent = workshop.registeredStudents.some(
        (id) => id.toString() === userId
      );

      if (!isMentor && !isStudent) {
        return res.status(403).json({ message: "Access denied" });
      }

      const roomName = `workshop-${id}`;

      const durationMinutes = parseInt(workshop.duration) || 60;
      const datePart = new Date(workshop.date).toISOString().split("T")[0];
      const startTime = new Date(`${datePart}T${workshop.time}:00`);

      const expirationSeconds = Math.floor(
        (startTime.getTime() + durationMinutes * 60000 - Date.now()) / 1000
      );
      console.log("User:", req.user);
      console.log("Room Type:", req.query.type);
      console.log("Workshop ID:", req.params.id);
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
  } else if (type == "booking") {
    try {
      const session = await Booking.findById(id).lean();
      if (!session)
        return res.status(404).json({ message: "Booking not found" });

      const isMentor = userId === session.mentor._id.toString();
      const isStudent = userId === session.student._id.toString();

      if (!isMentor && !isStudent) {
        return res.status(403).json({ message: "Access denied" });
      }

      const { date, timeSlot } = session;
      const startTimeStr = timeSlot?.[0]?.start;
      const endTimeStr = timeSlot?.[0]?.end;

      if (!date || !startTimeStr || !endTimeStr) {
        return res.status(400).json({ message: "Invalid session date/time" });
      }

      const [startHour, startMin] = startTimeStr.split(":").map(Number);
      const [endHour, endMin] = endTimeStr.split(":").map(Number);

      const startDate = new Date(date);
      startDate.setHours(startHour, startMin, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(endHour, endMin, 0, 0);

      const durationMinutes = Math.max(
        1,
        Math.floor((endDate - startDate) / 60000)
      );
      const expirationDate = new Date(
        startDate.getTime() + durationMinutes * 60000
      );
      const expirationSeconds = Math.floor(expirationDate.getTime() / 1000);

      const roomName = `session-${id}`;

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
  } else {
    console.error("Unvalid type");
    return null;
  }
};
