import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir =
  "D:\\eq-jaimin-p-mern-stack-internship-2025\\backend\\src\\uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

export const upload = multer({
  storage,
  // Max limit of 5 images, each with a file size of max 5MB
  limits: { files: 5, fileSize: 5 * 1024 * 1024 },
});
