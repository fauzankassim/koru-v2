"use client";

import { Loader2 } from "lucide-react";

export function RegeneratingOverlay() {
  return (
    <div className="absolute inset-0 z-10 rounded-2xl bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 animate-in fade-in-0 duration-200">
      <Loader2 className="h-6 w-6 text-primary animate-spin" />
      <p className="text-sm text-muted-foreground">Growing new materials at your current level…</p>
    </div>
  );
}