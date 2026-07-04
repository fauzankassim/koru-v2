"use client";

import { useEffect, useState } from "react";
import { Topic } from "@/lib/types";
import { TopicCard } from "@/components/topic-card";
import { TopicCardSkeleton } from "@/components/topic-card-skeleton";
import { GeneratingCard } from "@/components/generating-card";
import { PromptInput } from "@/components/prompt-input";

export default function DashboardPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [promptInput, setPromptInput] = useState("");
  const [generatingLabel, setGeneratingLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/topics")
      .then((r) => r.json())
      .then((d) => setTopics(d.topics ?? []))
      .finally(() => setInitialLoading(false));
  }, []);

  async function handleAddTopic() {
    if (!promptInput.trim() || generatingLabel) return;
    const input = promptInput.trim();
    setGeneratingLabel(input);
    setError(null);
    setPromptInput("");
    try {
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create topic");
      setTopics((prev) => [data.topic, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setGeneratingLabel(null);
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-14">
      <header className="mb-12">
        <p className="font-mono-num text-xs uppercase tracking-widest text-secondary mb-3">
          adaptive learning
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-3">Koru</h1>
        <p className="text-muted-foreground max-w-md">
          Describe a topic or a goal — Koru figures out what to teach and grows a spiral for it.
        </p>
      </header>

      <div className="mb-10 max-w-xl">
        <PromptInput
          value={promptInput}
          onChange={setPromptInput}
          onSubmit={handleAddTopic}
          disabled={!!generatingLabel}
          placeholder='"Quantum Computing" or "I want my staff better at digitalization"'
        />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {initialLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <TopicCardSkeleton key={i} />
          ))}
        </div>
      ) : topics.length === 0 && !generatingLabel ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
          Nothing planted yet. Describe a topic or goal above to grow your first spiral.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {generatingLabel && <GeneratingCard topicName={generatingLabel} />}
          {topics.map((topic, i) => (
            <div
              key={topic.id}
              className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
              style={{ animationDelay: `${Math.min(i, 6) * 40}ms`, animationFillMode: "backwards" }}
            >
              <TopicCard topic={topic} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}