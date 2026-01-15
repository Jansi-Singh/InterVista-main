import { Evaluation, InterviewSession, Question, User } from "../types";
import crypto from "crypto";

export const users: User[] = [];
export const sessions: InterviewSession[] = [];
export const questions: Question[] = [];
export const evaluations: Evaluation[] = [];

export function generateId(): string {
  return crypto.randomBytes(12).toString("hex");
}

