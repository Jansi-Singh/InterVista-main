"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEvaluation, getSession, type Evaluation, type InterviewSession } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { FeedbackCard } from "@/components/evaluation/feedback-card";
import { ScoreRing } from "@/components/evaluation/score-ring";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function EvaluationPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const sessionId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [session, setSession] = useState<InterviewSession | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }
    loadEvaluationData();
  }, [sessionId, isAuthenticated]);

  async function loadEvaluationData() {
    try {
      setLoading(true);
      setError(null);
      
      const [sessionData, evaluationsData] = await Promise.all([
        getSession(sessionId),
        getEvaluation(sessionId)
      ]);
      
      setSession(sessionData);
      setEvaluations(evaluationsData);
      
      if (evaluationsData.length === 0) {
        setError("No evaluation data found for this session");
      }
    } catch (error: any) {
      console.error("Failed to load evaluation:", error);
      setError(error.message || "Failed to load evaluation. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-16 flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading evaluation...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-16 flex items-center justify-center bg-background">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-destructive text-lg mb-4">{error}</div>
            <Button onClick={() => router.push("/dashboard")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Dashboard
            </Button>
          </div>
        </div>
      </>
    );
  }

  const overallScore = evaluations.length > 0
    ? Math.round(evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length)
    : 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16 bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-4xl font-bold mb-2">Interview Evaluation</h1>
            {session && (
              <p className="text-muted-foreground">
                {session.role} - {session.level}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Overall Score</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <ScoreRing score={overallScore} size={200} />
                <div className="mt-4 text-center">
                  <p className="text-2xl font-bold">{overallScore}%</p>
                  <p className="text-sm text-muted-foreground">Performance</p>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
              {evaluations.map((evaluation, index) => (
                <FeedbackCard
                  key={evaluation.questionId}
                  evaluation={evaluation}
                  questionNumber={index + 1}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/dashboard">
                <TrendingUp className="w-4 h-4 mr-2" />
                View All Sessions
              </Link>
            </Button>
            {session && (
              <Button variant="outline" asChild>
                <Link href={`/interview/${sessionId}`}>
                  Review Interview
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
