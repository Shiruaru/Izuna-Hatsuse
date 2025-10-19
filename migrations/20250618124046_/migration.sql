/*
  Warnings:

  - You are about to drop the column `antiSpam` on the `Security` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Security" DROP COLUMN "antiSpam",
ADD COLUMN     "antiDiscordInvite" BOOLEAN NOT NULL DEFAULT false;
