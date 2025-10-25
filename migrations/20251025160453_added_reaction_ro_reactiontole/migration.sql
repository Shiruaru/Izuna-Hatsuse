/*
  Warnings:

  - Added the required column `reaction` to the `RoleReaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RoleReaction" ADD COLUMN     "reaction" TEXT NOT NULL;
