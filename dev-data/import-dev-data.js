import fs from "fs/promises";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import Workshop from "./../models/Workshop.js";
import User from "./../models/User.js";
import Review from "./../models/Review.js";
import Booking from "../models/Booking.js";

dotenv.config({ path: "./config.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to DB
try {
  await mongoose.connect(
    "mongodb+srv://alitharwathassan:rnCMERhKmSUSlHA4@cluster0.o25p0do.mongodb.net/Daf3a?retryWrites=true&w=majority&appName=Cluster0"
  );
  console.log("DB connection successful");
} catch (err) {
  console.error("DB connection failed:", err);
}

// Read JSON files
const workshops = JSON.parse(
  await fs.readFile(`${__dirname}/workshops.json`, "utf-8")
);
const users = JSON.parse(await fs.readFile(`${__dirname}/users.json`, "utf-8"));
const bookings = JSON.parse(
  await fs.readFile(`${__dirname}/bookings.json`, "utf-8")
);
const reviews = JSON.parse(
  await fs.readFile(`${__dirname}/reviews.json`, "utf-8")
);

// Import data (with password hashing via schema hook)
const importData = async () => {
  try {
    await Workshop.create(workshops);

    // Loop through users and use .save() to trigger password hashing
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
    }

    await Booking.create(bookings);

    await Review.create(reviews);
    console.log("Data imported successfully with hashed passwords");
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

// Delete data
const deleteData = async () => {
  try {
    await Workshop.deleteMany();
    await User.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();
    console.log("Data deleted successfully");
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

// Run based on CLI argument
const arg = process.argv[2];
if (arg === "--import") {
  await importData();
} else if (arg === "--delete") {
  await deleteData();
}
