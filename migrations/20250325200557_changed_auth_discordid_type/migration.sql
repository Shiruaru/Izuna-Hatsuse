/*
  Warnings:

  - The primary key for the `Account` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Account" DROP CONSTRAINT "Account_pkey",
ALTER COLUMN "discordId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Account_pkey" PRIMARY KEY ("discordId");

-- AlterTable
ALTER TABLE "Auth" ALTER COLUMN "discordId" DROP DEFAULT,
ALTER COLUMN "discordId" SET DATA TYPE TEXT;
