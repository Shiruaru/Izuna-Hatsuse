-- CreateTable
CREATE TABLE "Auth" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "accessKey" TEXT NOT NULL,
    "discordId" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "discordId" INTEGER NOT NULL,
    "roles" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("discordId")
);
