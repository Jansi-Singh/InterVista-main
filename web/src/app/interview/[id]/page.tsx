"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { VideoCallInterface } from "@/components/interview/video-call-interface";
import { getQuestions, getSession, type Question, type InterviewSession } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";

export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const sessionId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }
    loadInterviewData();
  }, [sessionId, isAuthenticated]);

  async function loadInterviewData() {
    try {
      setLoading(true);
      setError(null);
      
      // Load session and questions in parallel
      const [sessionData, questionsData] = await Promise.all([
        getSession(sessionId),
        getQuestions(sessionId)
      ]);
      
      setSession(sessionData);
      setQuestions(questionsData);
      
      if (questionsData.length === 0) {
        setError("No questions found for this session");
      }
    } catch (error: any) {
      console.error("Failed to load interview:", error);
      setError(error.message || "Failed to load interview. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleEndInterview();
    }
  }

  function handleEndInterview() {
    router.push(`/evaluation/${sessionId}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-destructive text-lg mb-4">{error}</div>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-primary hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No questions found</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-primary hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <VideoCallInterface
      sessionId={sessionId}
      question={currentQuestion.text}
      questionNumber={currentQuestionIndex + 1}
      totalQuestions={questions.length}
      onNextQuestion={handleNextQuestion}
      onEndInterview={handleEndInterview}
    />
  );
}
