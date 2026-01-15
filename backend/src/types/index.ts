export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export type SessionStatus = "pending" | "in_progress" | "completed" | "failed";

export interface InterviewSession {
  id: string;
  userId: string;
  role: string;
  level: string;
  status: SessionStatus;
  createdAt: string;
  completedAt?: string;
  score?: number;
}

export interface Question {
  id: string;
  sessionId: string;
  text: string;
  order: number;
  answer?: string;
  audioPath?: string;
  score?: number;
  feedback?: string;
}

export interface Evaluation {
  sessionId: string;
  questionId: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  overallScore?: number;
}

