import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { topicStore, preferenceStore } from "@/lib/storage";
import { generateJSON } from "@/lib/agent";
import { buildTopicSystemPrompt, buildTopicUserPrompt } from "@/prompts/system";
import { Topic, GeneratedTopicPackage } from "@/lib/types";

export async function GET() {
  const topics = await topicStore.all();
  return NextResponse.json({ topics });
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "A topic or goal description is required" }, { status: 400 });
    }

    const elo = 1000;
    const preferences = await preferenceStore.get();
    const { title, ...materials } = await generateJSON<GeneratedTopicPackage>(
      buildTopicSystemPrompt(preferences),
      buildTopicUserPrompt(prompt.trim(), elo)
    );

    const topic: Topic = {
      id: randomUUID(),
      name: title,
      elo,
      createdAt: new Date().toISOString(),
      materials,
      history: [],
      preferences,
    };

    const saved = await topicStore.create(topic);
    return NextResponse.json({ topic: saved }, { status: 201 });
  } catch (err) {
    console.error("Failed to generate topic:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate topic" },
      { status: 500 }
    );
  }
}