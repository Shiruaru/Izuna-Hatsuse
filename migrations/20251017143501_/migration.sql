-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "wlcChannel" TEXT,
    "ruleChannel" TEXT,
    "warnChannel" TEXT,
    "memberRole" TEXT,
    "moderatorRole" TEXT,
    "adminRole" TEXT,
    "ticketCategory" TEXT,

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
    "antiDiscordInvite" BOOLEAN NOT NULL DEFAULT false,

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
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "guildId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "comment" TEXT,
    "messageId" TEXT NOT NULL,
    "claimedById" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closeDate" TIMESTAMP(3),

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auth" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "accessKey" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_messageId_key" ON "Ticket"("messageId");

-- AddForeignKey
ALTER TABLE "Warn" ADD CONSTRAINT "Warn_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
