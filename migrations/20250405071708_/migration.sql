/*
  Warnings:

  - Added the required column `id` to the `CommandConfig` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CommandConfig_commandId_key";

-- AlterTable
ALTER TABLE "CommandConfig" ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "CommandConfig_pkey" PRIMARY KEY ("id");
