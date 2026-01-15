import { Response } from "express";
import { sessions, questions, generateId, evaluations } from "../db/mockDb";
import { AuthRequest } from "../middleware/auth";
import { InterviewSession, Question, Evaluation } from "../types";

const SAMPLE_QUESTIONS = [
  "Tell me about yourself.",
  "Describe a challenging project you worked on.",
  "How do you handle tight deadlines?",
  "Explain a time you disagreed with a teammate and how you resolved it.",
  "Where do you see yourself in five years?"
];

export function createSession(req: AuthRequest, res: Response): void {
  const { role, level } = req.body as { role?: string; level?: string };
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (!role || !level) {
    res.status(400).json({ error: "Role and level are required" });
    return;
  }

  const session: InterviewSession = {
    id: generateId(),
    userId: req.user.userId,
    role,
    level,
    status: "pending",
    createdAt: new Date().toISOString()
  };
  sessions.push(session);

  // Create some mock questions for the session
  const sessionQuestions: Question[] = SAMPLE_QUESTIONS.map((text, index) => ({
    id: generateId(),
    sessionId: session.id,
    text,
    order: index + 1
  }));
  questions.push(...sessionQuestions);

  res.status(201).json(session);
}

export function getSessions(req: AuthRequest, res: Response): void {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const userSessions = sessions.filter((s) => s.userId === req.user!.userId);
  res.json(userSessions);
}

export function getSessionById(req: AuthRequest, res: Response): void {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { id } = req.params;
  const session = sessions.find((s) => s.id === id && s.userId === req.user!.userId);
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  res.json(session);
}

export function getSessionQuestions(req: AuthRequest, res: Response): void {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { id } = req.params;
  const session = sessions.find((s) => s.id === id && s.userId === req.user!.userId);
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  const qs = questions
    .filter((q) => q.sessionId === id)
    .sort((a, b) => a.order - b.order);

  res.json(qs);
}

export function getEvaluationForSession(req: AuthRequest, res: Response): void {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { sessionId } = req.params;
  const session = sessions.find((s) => s.id === sessionId && s.userId === req.user!.userId);
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  const sessionEvaluations: Evaluation[] = evaluations.filter((e) => e.sessionId === sessionId);
  res.json(sessionEvaluations);
}

