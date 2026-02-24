import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/audio",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const uploadAudio = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});
