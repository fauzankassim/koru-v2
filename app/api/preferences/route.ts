import { NextRequest, NextResponse } from "next/server";
import { preferenceStore } from "@/lib/storage";
import { LearningPreferences } from "@/lib/types";

export async function GET() {
  const prefs = await preferenceStore.get();
  return NextResponse.json({ preferences: prefs });
}

export async function PUT(req: NextRequest) {
  const body = (await req.json()) as LearningPreferences;
  const updated = await preferenceStore.update(body);
  return NextResponse.json({ preferences: updated });
}