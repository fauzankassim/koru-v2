"use client";

import { useState } from "react";

export function FlashcardItem({
  question,
  answer,
  onFlip,
}: {
  question: string;
  answer: string;
  onFlip?: () => void;
}) {
  const [flipped, setFlipped] = useState(false);

  function toggle() {
    if (!flipped) onFlip?.();
    setFlipped((f) => !f);
  }

  return (
    <button
      onClick={toggle}
      className="text-left [perspective:1000px] min-h-[130px]"
      aria-label={flipped ? "Show question" : "Show answer"}
    >
      <div
        className="relative w-full h-full min-h-[130px] transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <div className="absolute inset-0 rounded-2xl border border-border bg-card p-4 flex flex-col items-center justify-center text-center [backface-visibility:hidden]">
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Question</p>
          <p className="text-foreground">{question}</p>
        </div>
        <div
          className="absolute inset-0 rounded-2xl border border-primary/30 bg-primary/5 p-4 flex flex-col items-center justify-center text-center [backface-visibility:hidden]"
          style={{ transform: "rotateY(180deg)" }}
        >
          <p className="text-xs text-secondary mb-2 uppercase tracking-wide">Answer</p>
          <p className="text-foreground">{answer}</p>
        </div>
      </div>
    </button>
  );
}