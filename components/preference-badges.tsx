import { LearningPreferences } from "@/lib/types";
import { Lightbulb, Wrench, Code2, MessageCircle, Briefcase, Globe2, Shapes } from "lucide-react";

const explanationIcons = {
  analogies: { icon: Lightbulb, label: "Analogies" },
  practical: { icon: Wrench, label: "Practical" },
  technical: { icon: Code2, label: "Technical" },
};

const toneIcons = {
  casual: { icon: MessageCircle, label: "Casual" },
  formal: { icon: Briefcase, label: "Formal" },
};

const exampleIcons = {
  real_world: { icon: Globe2, label: "Real-world" },
  abstract: { icon: Shapes, label: "Abstract" },
};

export function PreferenceBadges({
  preferences,
  size = "sm",
}: {
  preferences: LearningPreferences;
  size?: "sm" | "md";
}) {
  const items = [
    explanationIcons[preferences.explanationStyle],
    toneIcons[preferences.tone],
    exampleIcons[preferences.exampleStyle],
  ];

  const iconSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";
  const padding = size === "sm" ? "px-1.5 py-0.5" : "px-2 py-1";

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map(({ icon: Icon, label }) => (
        <span
          key={label}
          className={`inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 text-muted-foreground ${padding} ${textSize}`}
        >
          <Icon className={iconSize} />
          {label}
        </span>
      ))}
    </div>
  );
}