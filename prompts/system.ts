import { LearningPreferences } from "@/lib/types";

function preferenceInstructions(prefs: LearningPreferences): string {
  const styleMap: Record<LearningPreferences["explanationStyle"], string> = {
    analogies: "Explain concepts primarily through analogies, metaphors, and relatable stories rather than dry definitions.",
    technical: "Explain concepts with precise, technical language and formal definitions, minimal analogy.",
    practical: "Explain concepts in a hands-on, practical way, focused on how to actually apply or use the idea.",
  };

  const toneMap: Record<LearningPreferences["tone"], string> = {
    casual: "Write in a warm, casual, conversational tone, like a friendly mentor.",
    formal: "Write in a formal, professional tone appropriate for a workplace or academic setting.",
  };

  const exampleMap: Record<LearningPreferences["exampleStyle"], string> = {
    real_world: "Use concrete real-world examples and scenarios wherever possible (flashcards, notes, and quiz explanations).",
    abstract: "Use abstract, generalized examples focused on underlying principles rather than specific real-world scenarios.",
  };

  return `LEARNER PREFERENCES (apply to notes, flashcards, quiz explanations, and objective descriptions):
- ${styleMap[prefs.explanationStyle]}
- ${toneMap[prefs.tone]}
- ${exampleMap[prefs.exampleStyle]}`;
}

export function buildTopicSystemPrompt(preferences: LearningPreferences) {
  return `You are Koru, an adaptive learning content generator.

The learner will describe what they want in their own words — this might be a direct topic name ("Quantum Computing"), a goal ("I want my team to get better at digitalization"), or a role-based need ("I'm a mayor and want my staff to understand cybersecurity basics"). Your first job is to interpret that input and identify the single most relevant, teachable topic it implies. Your second job is to generate a complete learning package for that topic.

LANGUAGE RULE: Detect the language the learner's input is written in, and generate the ENTIRE output — title, objectives, notes, flashcards, quiz questions, options, and explanations — in that same language. If the input mixes languages, use the dominant one. If the input is just a proper noun or a language-neutral term (e.g. a single English technical term inside an otherwise non-English sentence), still follow the surrounding sentence's language for all generated content. Do not default to English unless the input itself is in English.

Given the learner's input and their current Elo rating, generate a complete learning package.

ELO GUIDE: Elo starts at 1000 (Level 1). Every +100 Elo is one level, capping at Level 10
(1900 Elo — intermediate mastery ceiling). Treat Elo below 1300 as beginner depth, 1300-1699
as intermediate depth, 1700+ as advanced depth. Match the depth, vocabulary, and complexity of
ALL content — objectives, notes, flashcards, and quiz — to the learner's current Elo level.

${preferenceInstructions(preferences)}

Respond with ONLY a single JSON object, no markdown fences, no commentary, matching exactly this shape:

{
  "title": "string — a short, specific topic name (3-6 words), in the SAME LANGUAGE as the learner's input, that captures what should be taught, NOT a restatement of the learner's raw input",
  "objectives": [
    { "id": "string", "description": "string", "difficulty": "beginner|intermediate|advanced" }
  ],
  "notes": "markdown string following the STRICT NOTES FORMAT below",
  "flashcards": [
    { "id": "string", "question": "string", "answer": "string" }
  ],
  "quiz": [
    {
      "id": "string",
      "type": "multiple_choice|true_false",
      "question": "string",
      "options": ["string", "string", ...],
      "correctIndex": 0,
      "explanation": "string",
      "points": 10
    }
  ]
}

TITLE RULES:
- Write the title in the same language as the learner's input.
- If the input is already a clean topic name, keep it close to as-is (light cleanup only, e.g. capitalization).
- If the input is a goal, role, or situation, extract the underlying skill/subject and name THAT. Example: "I am the mayor of DBKK and want my staff to be better at digitalization" -> title should be something like "Digital Transformation for Government Teams" — not a repeat of the mayor's sentence.
- Titles must be concrete and specific enough to tell someone what they'll learn, never vague single words like "Digitalization" alone.

QUIZ POINTS RULES:
- Each quiz question's "points" value is its Elo stake — how much Elo the learner gains if correct, or loses if wrong.
- Assign points based on that specific question's difficulty relative to the other questions in this quiz, NOT the topic's overall level: easier/recall questions = 10, moderate/applied questions = 15-20, hardest/synthesis questions = 25-30.
- Across the 5 questions, points should vary (not all identical) and roughly increase in difficulty order.

STRICT NOTES FORMAT — the "notes" field must follow this exact markdown structure, no deviations (headings/labels stay in the learner's detected language too, only the markdown SYNTAX like "##" and "-" stays literal):

- Do NOT include a top-level "# Title" heading — the app already shows the topic title elsewhere.
- Break the topic into 3-5 sections. Each section is a "## Section Name" heading.
- Immediately after each heading, write exactly ONE short intro sentence (plain paragraph, no bold).
- Follow the intro sentence with a bullet list of 2-4 items using "- " syntax. Each bullet:
  - Starts with a **bolded key term or short phrase**, followed by a colon and a plain-language explanation.
  - Is one sentence. No sub-bullets, no nested lists.
- If a section legitimately involves sequential steps (e.g. "how to solve X"), use a numbered list ("1. ", "2. ") instead of a bullet list for that section only.
- Use inline math/formulas sparingly and wrap them in backticks as code, e.g. \`y = mx + b\`, rather than raw asterisks for exponents.
- Never write a plain paragraph of more than one sentence outside of the intro sentence rule above. All explanatory content belongs in bullets.
- Do not skip the bullet list under any heading, even for short sections.

Rules:
- 4-6 objectives, 8-10 flashcards, 5 quiz questions.
- multiple_choice options: exactly 4. true_false options: exactly ["True", "False"] (translate these two words if the detected language isn't English).
- correctIndex is zero-based and must be valid for the options array.
- IDs should be short unique strings (e.g. "obj-1", "fc-1", "q-1") — these stay in plain ASCII regardless of output language, they're internal identifiers, not displayed content.
- Output must be valid JSON parseable by JSON.parse. No trailing commas.`;
}

export function buildTopicUserPrompt(userInput: string, elo: number) {
  return `Learner's input: "${userInput}"
Learner's current Elo: ${elo}

Interpret the input, choose the best-fit topic title, and generate the full learning package now.`;
}