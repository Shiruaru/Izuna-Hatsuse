-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "wlcChannel" TEXT,
    "ruleChannel" TEXT,
    "warnChannel" TEXT,
    "memberRole" TEXT,
    "ticketStatus" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logs" (
    "guildId" TEXT NOT NULL,
    "messageLogStatus" BOOLEAN NOT NULL,
    "messageLogChannel" TEXT,
    "adminLogStatus" BOOLEAN NOT NULL,
    "adminLogChannel" TEXT,
    "memberLogStatus" BOOLEAN NOT NULL,
    "memberLogChannel" TEXT,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("guildId")
);

-- CreateTable
CREATE TABLE "Security" (
    "guildId" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "adminRoles" TEXT,
    "moderatorRoles" TEXT,

    CONSTRAINT "Security_pkey" PRIMARY KEY ("guildId")
);

-- CreateTable
CREATE TABLE "Warn" (
    "id" SERIAL NOT NULL,
    "guildId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Warn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commands" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "permissions" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "custom" BOOLEAN NOT NULL,

    CONSTRAINT "Commands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "guildId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "claimedById" TEXT NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Warn" ADD CONSTRAINT "Warn_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
