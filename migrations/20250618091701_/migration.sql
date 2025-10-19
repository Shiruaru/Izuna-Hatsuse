-- AlterTable
ALTER TABLE "Commands" ALTER COLUMN "status" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Security" ADD COLUMN     "antiSpam" BOOLEAN NOT NULL DEFAULT false;
