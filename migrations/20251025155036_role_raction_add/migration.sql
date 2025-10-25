-- CreateTable
CREATE TABLE "RoleReaction" (
    "id" SERIAL NOT NULL,
    "guildId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "RoleReaction_pkey" PRIMARY KEY ("id")
);
