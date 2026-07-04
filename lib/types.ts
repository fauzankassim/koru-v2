export interface LearningObjective {
  id: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface FlashCard {
  id: string;
  question: string;
  answer: string;
}

export interface QuizQuestion {
  id: string;
  type: "multiple_choice" | "true_false";
  question: string;
  options: string[]; // for true_false use ["True", "False"]
  correctIndex: number;
  explanation: string;
  points: number;
}

export interface TopicMaterials {
  objectives: LearningObjective[];
  notes: string; // markdown
  flashcards: FlashCard[];
  quiz: QuizQuestion[];
}

export interface Topic {
  id: string;
  name: string;
  elo: number;
  createdAt: string;
  materials: TopicMaterials;
  history: { date: string; correct: number; total: number; eloAfter: number }[];
}

export interface GeneratedTopicPackage extends TopicMaterials {
  title: string;
}