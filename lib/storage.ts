import { prisma } from "./prisma";
import { Topic, TopicMaterials } from "./types";

// Prisma stores materials/history as JSON strings (see schema.prisma).
// These helpers convert between that and the app-level Topic shape.
function fromDb(row: {
  id: string;
  name: string;
  elo: number;
  createdAt: Date;
  materials: string;
  history: string;
}): Topic {
  return {
    id: row.id,
    name: row.name,
    elo: row.elo,
    createdAt: row.createdAt.toISOString(),
    materials: JSON.parse(row.materials) as TopicMaterials,
    history: JSON.parse(row.history) as Topic["history"],
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
      },
    });
    return fromDb(row);
  },

  async update(
    id: string,
    updates: Partial<Pick<Topic, "name" | "elo" | "materials" | "history">>
  ): Promise<Topic> {
    const row = await prisma.topic.update({
      where: { id },
      data: {
        ...(updates.name !== undefined ? { name: updates.name } : {}),
        ...(updates.elo !== undefined ? { elo: updates.elo } : {}),
        ...(updates.materials !== undefined ? { materials: JSON.stringify(updates.materials) } : {}),
        ...(updates.history !== undefined ? { history: JSON.stringify(updates.history) } : {}),
      },
    });
    return fromDb(row);
  },

  async delete(id: string): Promise<void> {
    await prisma.topic.delete({ where: { id } }).catch(() => {
      // ignore if already deleted
    });
  },
};