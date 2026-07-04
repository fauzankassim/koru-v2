-- CreateTable
CREATE TABLE "Preference" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "explanationStyle" TEXT NOT NULL DEFAULT 'practical',
    "tone" TEXT NOT NULL DEFAULT 'casual',
    "exampleStyle" TEXT NOT NULL DEFAULT 'real_world',

    CONSTRAINT "Preference_pkey" PRIMARY KEY ("id")
);
