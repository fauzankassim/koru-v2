-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "elo" INTEGER NOT NULL DEFAULT 1000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "materials" TEXT NOT NULL,
    "history" TEXT NOT NULL DEFAULT '[]',

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);
