"use client";

import { useState } from "react";
import { QuizQuestion } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export type QuizResult = {
  correct: number;
  total: number;
  newElo: number;
  eloDelta: number;
  results: {
    id: string;
    isCorrect: boolean;
    correctIndex: number;
    explanation: string;
    points: number;
    eloChange: number;
  }[];
};

const optionLabels = ["A", "B", "C", "D"];

export function QuizSection({
  topicId,
  quiz,
  result,
  onSubmitted,
}: {
  topicId: string;
  quiz: QuizQuestion[];
  result: QuizResult | null;
  onSubmitted: (result: QuizResult) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === quiz.length;

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/topics/${topicId}/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      onSubmitted(data);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {!result && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{answeredCount} of {quiz.length} answered</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(answeredCount / quiz.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {quiz.map((q, i) => {
          const questionResult = result?.results.find((r) => r.id === q.id);

          return (
            <div key={q.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <p className="font-medium flex gap-2">
                  <span className="font-mono-num text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  {q.question}
                </p>
                <span className="font-mono-num text-xs shrink-0 mt-0.5">
                  {questionResult ? (
                    <span className={questionResult.eloChange > 0 ? "text-primary" : "text-destructive"}>
                      {questionResult.eloChange > 0 ? "+" : ""}
                      {questionResult.eloChange} elo
                    </span>
                  ) : (
                    <span className="text-muted-foreground">{q.points} elo</span>
                  )}
                </span>
              </div>
              <div className="space-y-2">
                {q.options.map((opt, idx) => {
                  const chosen = answers[q.id] === idx;
                  const showFeedback = result !== null;
                  const isCorrectOpt = idx === q.correctIndex;
                  let style = "border-border hover:border-secondary/50";
                  let badgeStyle = "border-border text-muted-foreground";
                  if (showFeedback && isCorrectOpt) {
                    style = "border-primary bg-primary/10";
                    badgeStyle = "border-primary bg-primary text-primary-foreground";
                  } else if (showFeedback && chosen && !isCorrectOpt) {
                    style = "border-destructive bg-destructive/10";
                    badgeStyle = "border-destructive bg-destructive text-destructive-foreground";
                  } else if (chosen) {
                    style = "border-secondary bg-secondary/10";
                    badgeStyle = "border-secondary bg-secondary text-secondary-foreground";
                  }

                  return (
                    <button
                      key={idx}
                      disabled={result !== null}
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: idx }))}
                      className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl border transition-colors ${style}`}
                    >
                      <span
                        className={`font-mono-num text-xs h-6 w-6 shrink-0 rounded-full border flex items-center justify-center ${badgeStyle}`}
                      >
                        {optionLabels[idx] ?? idx + 1}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
              {result && (
                <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border">
                  {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        {!result ? (
          <Button onClick={handleSubmit} disabled={!allAnswered || submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Submitting…
              </>
            ) : (
              "Submit Quiz"
            )}
          </Button>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="font-mono-num text-foreground">
              {result.correct}/{result.total} correct · {result.eloDelta >= 0 ? "+" : ""}
              {result.eloDelta} elo
            </p>
          </div>
        )}
      </div>
    </div>
  );
}