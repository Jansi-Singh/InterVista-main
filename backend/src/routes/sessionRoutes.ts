import { Router } from "express";
import {
  createSession,
  getSessionById,
  getSessions,
  getSessionQuestions
} from "../controllers/sessionController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/", authMiddleware, createSession);
router.get("/", authMiddleware, getSessions);
router.get("/:id", authMiddleware, getSessionById);
router.get("/:id/questions", authMiddleware, getSessionQuestions);

export default router;

