"use client";

import Link from "next/link";
import { Topic } from "@/lib/types";
import { KoruSpiral } from "@/components/koru-spiral";
import { eloToLevel } from "@/lib/elo";

export function TopicCard({ topic }: { topic: Topic }) {
  const lastAttempt = topic.history[topic.history.length - 1];
  const { level, label, isMaxLevel } = eloToLevel(topic.elo);

  return (
    <Link href={`/topic/${topic.id}`} className="group block">
      <div className="rounded-2xl border border-border bg-card p-5 h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-display text-xl leading-tight text-foreground pr-2">
            {topic.name}
          </h3>
          <KoruSpiral elo={topic.elo} size={48} />
        </div>

        <p className="font-mono-num text-sm text-muted-foreground mb-1">
          Level {level} · {label}
          {isMaxLevel && <span className="text-accent"> · Max</span>}
        </p>

        <div className="text-sm text-muted-foreground space-y-0.5 mt-3 pt-3 border-t border-border">
          <p>{topic.materials.objectives.length} objectives · {topic.materials.flashcards.length} cards</p>
          {lastAttempt ? (
            <p className="font-mono-num">
              last: {lastAttempt.correct}/{lastAttempt.total} correct
            </p>
          ) : (
            <p className="italic">not attempted yet</p>
          )}
        </div>
      </div>
    </Link>
  );
}