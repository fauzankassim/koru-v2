"use client";

import { useState } from "react";
import { LearningPreferences } from "@/lib/types";
import { PREFERENCE_OPTIONS } from "@/lib/preference-options";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

export function TopicRegenerateDialog({
  currentPreferences,
  onRegenerate,
  regenerating,
}: {
  currentPreferences: LearningPreferences;
  onRegenerate: (preferences: LearningPreferences) => void;
  regenerating: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<LearningPreferences>(currentPreferences);

  function handleOpenChange(next: boolean) {
    if (next) setPrefs(currentPreferences); // reset to this topic's current prefs each time it opens
    setOpen(next);
  }

  function handleConfirm() {
    setOpen(false);
    onRegenerate(prefs);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={regenerating}>
          {regenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Generating…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate new materials
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Regenerate with preferences</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {PREFERENCE_OPTIONS.map((group) => (
            <div key={group.key}>
              <p className="text-sm font-medium text-foreground mb-2">{group.label}</p>
              <div className="grid gap-2">
                {group.choices.map((choice) => {
                  const selected = prefs[group.key] === choice.value;
                  return (
                    <button
                      key={choice.value}
                      onClick={() =>
                        setPrefs((prev) => ({ ...prev, [group.key]: choice.value }))
                      }
                      className={`text-left rounded-xl border px-3 py-2.5 transition-colors ${
                        selected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-secondary/50"
                      }`}
                    >
                      <p className="text-sm font-medium text-foreground">{choice.label}</p>
                      <p className="text-xs text-muted-foreground">{choice.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <p className="text-xs text-muted-foreground mr-auto self-center">
            Applies to this topic only, this generation only
          </p>
          <Button onClick={handleConfirm}>Regenerate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}