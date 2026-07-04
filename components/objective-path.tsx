"use client";

import { LearningObjective } from "@/lib/types";

const tierStyles: Record<LearningObjective["difficulty"], string> = {
  beginner: "bg-secondary border-secondary",
  intermediate: "bg-primary border-primary",
  advanced: "bg-accent border-accent",
};

export function ObjectivePath({ objectives }: { objectives: LearningObjective[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      {objectives.map((o, i) => (
        <div key={o.id} className="relative flex gap-4 pb-6 last:pb-0">
          {i < objectives.length - 1 && (
            <div className="absolute left-[7px] top-4 bottom-0 w-px bg-border" />
          )}
          <div
            className={`relative z-10 mt-1.5 h-4 w-4 rounded-full border-2 shrink-0 ${tierStyles[o.difficulty]}`}
          />
          <div className="flex-1 flex items-start justify-between gap-3">
            <p className="text-foreground leading-snug">{o.description}</p>
            <span className="font-mono-num text-[10px] uppercase tracking-wide text-muted-foreground shrink-0 mt-0.5">
              {o.difficulty}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}