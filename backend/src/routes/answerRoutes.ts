import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { submitAnswer } from "../controllers/answerController";
import { getEvaluationForSession } from "../controllers/sessionController";
import { authMiddleware } from "../middleware/auth";

const uploadsDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const upload = multer({ storage });

const router = Router();

router.post("/", authMiddleware, upload.single("audio"), submitAnswer);
router.get("/evaluation/:sessionId", authMiddleware, getEvaluationForSession);

export default router;

