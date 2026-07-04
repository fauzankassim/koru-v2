"use client";

import { useEffect, useState } from "react";
import { LearningPreferences, DEFAULT_PREFERENCES } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings2, Loader2 } from "lucide-react";
import { PREFERENCE_OPTIONS } from "@/lib/preference-options";


export function PreferencesDialog() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<LearningPreferences>(DEFAULT_PREFERENCES);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open || loaded) return;
    fetch("/api/preferences")
      .then((r) => r.json())
      .then((d) => {
        if (d.preferences) setPrefs(d.preferences);
        setLoaded(true);
      });
  }, [open, loaded]);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          Learning style
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Learning preferences</DialogTitle>
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
            Applies to newly generated or regenerated materials
          </p>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}