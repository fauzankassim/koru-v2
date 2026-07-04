import { NextRequest, NextResponse } from "next/server";
import { topicStore } from "@/lib/storage";
import { updateEloFromQuiz } from "@/lib/elo";

// Body: { answers: { [questionId: string]: number } } (selected option index)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const topic = await topicStore.get(id);
  if (!topic) return NextResponse.json({ error: "Topic not found" }, { status: 404 });

  const { answers } = (await req.json()) as { answers: Record<string, number> };
  const quiz = topic.materials.quiz;

  let correct = 0;
  const scored = quiz.map((q) => {
    const selected = answers[q.id];
    const isCorrect = selected === q.correctIndex;
    if (isCorrect) correct += 1;
    return { id: q.id, isCorrect, points: q.points };
  });

  const { newElo, delta } = updateEloFromQuiz(topic.elo, scored);

  const results = quiz.map((q, i) => ({
    id: q.id,
    isCorrect: scored[i].isCorrect,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    points: q.points,
    eloChange: scored[i].isCorrect ? q.points : -q.points,
  }));

  const newHistory = [
    ...topic.history,
    { date: new Date().toISOString(), correct, total: quiz.length, eloAfter: newElo },
  ];

  await topicStore.update(id, { elo: newElo, history: newHistory });

  return NextResponse.json({
    correct,
    total: quiz.length,
    newElo,
    eloDelta: delta,
    results,
  });
}