import { prisma } from "./prisma";
import { Topic, TopicMaterials, LearningPreferences, DEFAULT_PREFERENCES } from "./types";
// Prisma stores materials/history as JSON strings (see schema.prisma).
// These helpers convert between that and the app-level Topic shape.
function fromDb(row: {
  id: string;
  name: string;
  elo: number;
  createdAt: Date;
  materials: string;
  history: string;
  preferences: string;
}): Topic {
  return {
    id: row.id,
    name: row.name,
    elo: row.elo,
    createdAt: row.createdAt.toISOString(),
    materials: JSON.parse(row.materials) as TopicMaterials,
    history: JSON.parse(row.history) as Topic["history"],
    preferences: JSON.parse(row.preferences) as LearningPreferences,
  };
}


export const topicStore = {
  async all(): Promise<Topic[]> {
    const rows = await prisma.topic.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map(fromDb);
  },

  async get(id: string): Promise<Topic | undefined> {
    const row = await prisma.topic.findUnique({ where: { id } });
    return row ? fromDb(row) : undefined;
  },

  async create(topic: Topic): Promise<Topic> {
    const row = await prisma.topic.create({
      data: {
        id: topic.id,
        name: topic.name,
        elo: topic.elo,
        materials: JSON.stringify(topic.materials),
        history: JSON.stringify(topic.history),
        preferences: JSON.stringify(topic.preferences),
      },
    });
    return fromDb(row);
  },

  async update(
    id: string,
    updates: Partial<Pick<Topic, "name" | "elo" | "materials" | "history" | "preferences">>
  ): Promise<Topic> {
    const row = await prisma.topic.update({
      where: { id },
      data: {
        ...(updates.name !== undefined ? { name: updates.name } : {}),
        ...(updates.elo !== undefined ? { elo: updates.elo } : {}),
        ...(updates.materials !== undefined ? { materials: JSON.stringify(updates.materials) } : {}),
        ...(updates.history !== undefined ? { history: JSON.stringify(updates.history) } : {}),
        ...(updates.preferences !== undefined ? { preferences: JSON.stringify(updates.preferences) } : {}),
      },
    });
    return fromDb(row);
  },

  async delete(id: string): Promise<void> {
    await prisma.topic.delete({ where: { id } }).catch(() => {});
  },
};

const PREFERENCE_ID = "default";

export const preferenceStore = {
  async get(): Promise<LearningPreferences> {
    const row = await prisma.preference.findUnique({ where: { id: PREFERENCE_ID } });
    if (!row) return DEFAULT_PREFERENCES;
    return {
      explanationStyle: row.explanationStyle as LearningPreferences["explanationStyle"],
      tone: row.tone as LearningPreferences["tone"],
      exampleStyle: row.exampleStyle as LearningPreferences["exampleStyle"],
    };
  },

  async update(prefs: LearningPreferences): Promise<LearningPreferences> {
    const row = await prisma.preference.upsert({
      where: { id: PREFERENCE_ID },
      create: { id: PREFERENCE_ID, ...prefs },
      update: { ...prefs },
    });
    return {
      explanationStyle: row.explanationStyle as LearningPreferences["explanationStyle"],
      tone: row.tone as LearningPreferences["tone"],
      exampleStyle: row.exampleStyle as LearningPreferences["exampleStyle"],
    };
  },
};