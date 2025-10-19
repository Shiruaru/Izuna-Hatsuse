/*
  Warnings:

  - The primary key for the `CommandConfig` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "CommandConfig" DROP CONSTRAINT "CommandConfig_pkey";
