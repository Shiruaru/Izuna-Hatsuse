/*
  Warnings:

  - You are about to drop the column `ticketStatus` on the `Guild` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Guild" DROP COLUMN "ticketStatus",
ADD COLUMN     "ticketCategory" BOOLEAN;
