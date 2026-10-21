-- CreateEnum
CREATE TYPE "TopupStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "TopupChannel" AS ENUM ('TRUEWALLET', 'BANK');

-- CreateTable
CREATE TABLE "authme" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "realname" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "ip" VARCHAR(40),
    "lastlogin" BIGINT,
    "x" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "y" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "z" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "world" VARCHAR(255) NOT NULL DEFAULT 'world',
    "regdate" BIGINT NOT NULL DEFAULT 0,
    "regip" VARCHAR(40),
    "yaw" REAL,
    "pitch" REAL,
    "email" VARCHAR(255),
    "islogged" SMALLINT NOT NULL DEFAULT 0,
    "hassession" SMALLINT NOT NULL DEFAULT 0,
    "totp" VARCHAR(32),
    "isAdmin" SMALLINT NOT NULL DEFAULT 0,
    "uuid" VARCHAR(36) NOT NULL,

    CONSTRAINT "authme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(25) NOT NULL,
    "subtitle" VARCHAR(25),
    "imageUrl" TEXT,
    "rconHost" VARCHAR(255) NOT NULL,
    "rconPort" VARCHAR(5) NOT NULL,
    "rconPassword" VARCHAR(255) NOT NULL,

    CONSTRAINT "server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item" (
    "id" SERIAL NOT NULL,
    "serverId" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "command" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "category" VARCHAR(25) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAvailable" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "itemId" INTEGER NOT NULL,
    "serverId" INTEGER NOT NULL,
    "pricePaid" INTEGER NOT NULL,
    "executedCommand" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topup" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "pointsAdded" INTEGER NOT NULL,
    "channel" "TopupChannel" NOT NULL,
    "status" "TopupStatus" NOT NULL DEFAULT 'SUCCESS',
    "reference" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "topup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playerpoints_migrations" (
    "migration_version" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "playerpoints_points" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(36) NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "playerpoints_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playerpoints_transaction_log" (
    "transaction_type" VARCHAR(20) NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "source" VARCHAR(36),
    "receiver" VARCHAR(36) NOT NULL,
    "amount" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "playerpoints_username_cache" (
    "uuid" VARCHAR(36) NOT NULL,
    "username" VARCHAR(30) NOT NULL
);

-- CreateTable
CREATE TABLE "setting" (
    "id" SERIAL NOT NULL,
    "siteName" VARCHAR(255) NOT NULL,
    "siteDesc" TEXT,
    "logo" VARCHAR(255),
    "serverIp" VARCHAR(15) NOT NULL,
    "serverImageUrl" VARCHAR(255),
    "serverName" VARCHAR(255) NOT NULL,
    "serverDesc" TEXT,
    "pointMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "enableTruewallet" BOOLEAN NOT NULL DEFAULT false,
    "enableBank" BOOLEAN NOT NULL DEFAULT false,
    "easyslipApiKey" VARCHAR(255),
    "truewalletPhoneNumber" VARCHAR(255) NOT NULL,

    CONSTRAINT "setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banner" (
    "id" SERIAL NOT NULL,
    "imageUrl" VARCHAR(255) NOT NULL,
    "link" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "banner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "username" ON "authme"("username");

-- CreateIndex
CREATE INDEX "authme_uuid_idx" ON "authme"("uuid");

-- CreateIndex
CREATE INDEX "item_serverId_idx" ON "item"("serverId");

-- CreateIndex
CREATE INDEX "transaction_username_idx" ON "transaction"("username");

-- CreateIndex
CREATE INDEX "transaction_itemId_idx" ON "transaction"("itemId");

-- CreateIndex
CREATE INDEX "transaction_serverId_idx" ON "transaction"("serverId");

-- CreateIndex
CREATE INDEX "topup_userId_idx" ON "topup"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "playerpoints_points_uuid_key" ON "playerpoints_points"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "playerpoints_username_cache_uuid_key" ON "playerpoints_username_cache"("uuid");

-- CreateIndex
CREATE INDEX "playerpoints_username_cache_username_index" ON "playerpoints_username_cache"("username");

-- CreateIndex
CREATE INDEX "playerpoints_username_cache_uuid_index" ON "playerpoints_username_cache"("uuid");
