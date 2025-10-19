/*
  Warnings:

  - You are about to drop the `CommandConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Commands` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommandConfig" DROP CONSTRAINT "CommandConfig_commandId_fkey";

-- DropForeignKey
ALTER TABLE "CommandConfig" DROP CONSTRAINT "CommandConfig_guildId_fkey";

-- DropTable
DROP TABLE "CommandConfig";

-- DropTable
DROP TABLE "Commands";

-- CreateTable
CREATE TABLE "Hoyolab" (
    "discordId" TEXT NOT NULL DEFAULT 'ERROR',
    "status" BOOLEAN NOT NULL,
    "ltoken" TEXT NOT NULL,
    "ltuid" TEXT NOT NULL,
    "genshinUID" TEXT NOT NULL,
    "hsrUID" TEXT NOT NULL,
    "zzzUID" TEXT NOT NULL,

    CONSTRAINT "Hoyolab_pkey" PRIMARY KEY ("discordId")
);
