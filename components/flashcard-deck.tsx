"use client";

import { useState } from "react";
import { FlashCard } from "@/lib/types";
import { FlashcardItem } from "@/components/flashcard-item";

export function FlashcardDeck({ cards }: { cards: FlashCard[] }) {
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());

  function markReviewed(id: string) {
    setReviewed((prev) => new Set(prev).add(id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground">Tap a card to flip it</p>
        <p className="font-mono-num text-sm text-secondary">
          {reviewed.size}/{cards.length} viewed
        </p>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-6">
        <div
          className="h-full bg-secondary transition-all duration-500"
          style={{ width: `${(reviewed.size / cards.length) * 100}%` }}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((fc) => (
          <FlashcardItem key={fc.id} question={fc.question} answer={fc.answer} onFlip={() => markReviewed(fc.id)} />
        ))}
      </div>
    </div>
  );
}