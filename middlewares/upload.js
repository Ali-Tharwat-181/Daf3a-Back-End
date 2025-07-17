import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the upload destination
const uploadDir = path.join(__dirname, "..", "uploads");

// Ensure the upload directory exists
fs.mkdirSync(uploadDir, { recursive: true });

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, filename);
  },
});

// File filter for images
function imageFileFilter(req, file, cb) {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, png, webp) are allowed."));
  }
}

// File filter for CVs (PDF, DOC, DOCX)
function cvFileFilter(req, file, cb) {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, and DOCX files are allowed."));
  }
}

// Multer instance for images
const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Multer instance for CVs
export const uploadCv = multer({
  storage,
  fileFilter: cvFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for CVs
});
// Multer error handler middleware
export function multerErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors (e.g., file too large)
    return res.status(400).json({ success: false, message: err.message });
  } else if (err) {
    // Custom file filter errors or other errors
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
}

export default upload;
