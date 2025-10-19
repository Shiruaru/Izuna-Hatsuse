-- CreateTable
CREATE TABLE "CommandConfig" (
    "guildId" TEXT NOT NULL,
    "commandId" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CommandConfig_pkey" PRIMARY KEY ("guildId")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommandConfig_commandId_key" ON "CommandConfig"("commandId");

-- AddForeignKey
ALTER TABLE "CommandConfig" ADD CONSTRAINT "CommandConfig_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommandConfig" ADD CONSTRAINT "CommandConfig_commandId_fkey" FOREIGN KEY ("commandId") REFERENCES "Commands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
