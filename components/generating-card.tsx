import { Loader2 } from "lucide-react";

export function GeneratingCard({ topicName }: { topicName: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-5 h-full flex flex-col justify-center items-center text-center gap-2 animate-pulse">
      <Loader2 className="h-6 w-6 text-primary animate-spin" />
      <p className="font-display text-lg text-foreground">{topicName}</p>
      <p className="text-xs text-muted-foreground">growing objectives, notes, flashcards…</p>
    </div>
  );
}