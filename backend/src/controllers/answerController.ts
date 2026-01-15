import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { evaluations, questions, sessions, generateId } from "../db/mockDb";
import { Evaluation } from "../types";

export function submitAnswer(req: AuthRequest, res: Response): void {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { sessionId, questionId } = req.body as { sessionId?: string; questionId?: string };

  if (!sessionId || !questionId) {
    res.status(400).json({ error: "sessionId and questionId are required" });
    return;
  }

  const session = sessions.find((s) => s.id === sessionId && s.userId === req.user!.userId);
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  const question = questions.find((q) => q.id === questionId && q.sessionId === sessionId);
  if (!question) {
    res.status(404).json({ error: "Question not found" });
    return;
  }

  const file = (req as any).file as Express.Multer.File | undefined;
  if (!file) {
    res.status(400).json({ error: "Audio file is required" });
    return;
  }

  question.audioPath = file.path;

  // Mock evaluation: generate basic feedback
  const score = Math.floor(Math.random() * 41) + 60; // 60-100
  const evaluation: Evaluation = {
    sessionId,
    questionId,
    score,
    feedback: "Mock evaluation: good structure, consider adding more specific examples.",
    strengths: ["Clear communication", "Good structure"],
    improvements: ["Add more concrete examples", "Highlight measurable impact"],
    overallScore: score
  };

  evaluations.push(evaluation);

  // Mark session as completed once there is at least one evaluation
  session.status = "completed";
  session.completedAt = new Date().toISOString();
  session.score = score;

  res.status(201).json({ message: "Answer received and evaluated (mock)", evaluationId: generateId() });
}

