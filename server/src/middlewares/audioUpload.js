import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = "uploads/audio";

// Ensure folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadPath,
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const uploadAudio = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});