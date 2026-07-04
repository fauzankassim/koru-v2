-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "preferences" TEXT NOT NULL DEFAULT '{"explanationStyle":"practical","tone":"casual","exampleStyle":"real_world"}';
