import { LearningPreferences } from "@/lib/types";

export const PREFERENCE_OPTIONS: {
  key: keyof LearningPreferences;
  label: string;
  choices: { value: string; label: string; desc: string }[];
}[] = [
  {
    key: "explanationStyle",
    label: "Explanation style",
    choices: [
      { value: "analogies", label: "Analogies & stories", desc: "Concepts explained through relatable comparisons" },
      { value: "practical", label: "Hands-on & practical", desc: "Focused on how to actually apply it" },
      { value: "technical", label: "Technical & precise", desc: "Formal definitions, minimal analogy" },
    ],
  },
  {
    key: "tone",
    label: "Tone",
    choices: [
      { value: "casual", label: "Casual", desc: "Warm, conversational, like a mentor" },
      { value: "formal", label: "Formal", desc: "Professional, workplace-appropriate" },
    ],
  },
  {
    key: "exampleStyle",
    label: "Examples",
    choices: [
      { value: "real_world", label: "Real-world", desc: "Concrete scenarios and use cases" },
      { value: "abstract", label: "Abstract", desc: "General principles, less scenario-based" },
    ],
  },
];