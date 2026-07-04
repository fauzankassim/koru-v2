"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Topic } from "@/lib/types";
import { eloToLevel } from "@/lib/elo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ObjectivePath } from "@/components/objective-path";
import { TopicNotes } from "@/components/topic-notes";
import { FlashcardDeck } from "@/components/flashcard-deck";
import { TopicTitle } from "@/components/topic-title";
import { QuizSection, QuizResult } from "@/components/quiz-section";
import { TopicPageSkeleton } from "@/components/topic-page-skeleton";
import { Loader2, Trash2 } from "lucide-react";

export default function TopicPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/topics/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.topic) setTopic(d.topic);
        else setNotFound(true);
      });
  }, [id]);

  if (notFound) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10 text-center">
        <p className="text-muted-foreground mb-4">This topic doesn&apos;t exist anymore.</p>
        <Button variant="outline" onClick={() => router.push("/")}>Back to dashboard</Button>
      </main>
    );
  }

  if (!topic) return <TopicPageSkeleton />;

  const { level, label, isMaxLevel } = eloToLevel(topic.elo);

  function handleQuizSubmitted(result: QuizResult) {
    setQuizResult(result);
    setTopic((prev) => (prev ? { ...prev, elo: result.newElo } : prev));
  }

  async function handleRegenerate() {
    setRegenerating(true);
    setQuizResult(null);
    try {
      const res = await fetch(`/api/topics/${id}/regenerate`, { method: "POST" });
      const data = await res.json();
      if (data.topic) setTopic(data.topic);
    } finally {
      setRegenerating(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${topic!.name}"? This can't be undone.`)) return;
    setDeleting(true);
    try {
      await fetch(`/api/topics/${id}`, { method: "DELETE" });
      router.push("/");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 animate-in fade-in-0 duration-300">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={() => router.push("/")} className="px-0">
          ← Back to dashboard
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={deleting}
          className="text-muted-foreground hover:text-destructive"
        >
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex flex-col justify-between mb-6 gap-2">
        <TopicTitle
          name={topic.name}
          topicId={id}
          onRenamed={(newName) => setTopic((prev) => (prev ? { ...prev, name: newName } : prev))}
        />
        <Badge className="shrink-0">
          Level {level} · {label}
          {isMaxLevel ? " (Max)" : ""}
        </Badge>
      </div>

      <Tabs defaultValue="objectives">
        <TabsList>
          <TabsTrigger value="objectives">Objectives</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
        </TabsList>

        <TabsContent value="objectives" className="mt-4">
          <ObjectivePath objectives={topic.materials.objectives} />
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <TopicNotes markdown={topic.materials.notes} />
        </TabsContent>

        <TabsContent value="flashcards" className="mt-4">
          <FlashcardDeck cards={topic.materials.flashcards} />
        </TabsContent>

        <TabsContent value="quiz" className="mt-4">
          <QuizSection
            topicId={id}
            quiz={topic.materials.quiz}
            result={quizResult}
            onSubmitted={handleQuizSubmitted}
          />
          {quizResult && (
            <div className="mt-4">
              <Button variant="outline" onClick={handleRegenerate} disabled={regenerating}>
                {regenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating…
                  </>
                ) : (
                  "Generate new materials"
                )}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}