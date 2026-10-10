-- CreateTable
CREATE TABLE `authme` (
    `id` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `realname` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `ip` VARCHAR(40) NULL,
    `lastlogin` BIGINT NULL,
    `x` DOUBLE NOT NULL DEFAULT 0,
    `y` DOUBLE NOT NULL DEFAULT 0,
    `z` DOUBLE NOT NULL DEFAULT 0,
    `world` VARCHAR(255) NOT NULL DEFAULT 'world',
    `regdate` BIGINT NOT NULL DEFAULT 0,
    `regip` VARCHAR(40) NULL,
    `yaw` FLOAT NULL,
    `pitch` FLOAT NULL,
    `email` VARCHAR(255) NULL,
    `isLogged` SMALLINT NOT NULL DEFAULT 0,
    `hasSession` SMALLINT NOT NULL DEFAULT 0,
    `totp` VARCHAR(32) NULL,
    `isAdmin` SMALLINT NOT NULL DEFAULT 0,
    `uuid` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `username`(`username`),
    INDEX `authme_uuid_idx`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `server` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(25) NOT NULL,
    `subtitle` VARCHAR(25) NULL,
    `imageUrl` TEXT NULL,
    `rconHost` VARCHAR(255) NOT NULL,
    `rconPort` VARCHAR(5) NOT NULL,
    `rconPassword` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serverId` INTEGER NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NOT NULL,
    `imageUrl` TEXT NULL,
    `command` TEXT NOT NULL,
    `price` INTEGER NOT NULL DEFAULT 0,
    `category` VARCHAR(25) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastUpdatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isAvailable` BOOLEAN NOT NULL DEFAULT false,

    INDEX `item_serverId_idx`(`serverId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `itemId` INTEGER NOT NULL,
    `serverId` INTEGER NOT NULL,
    `pricePaid` INTEGER NOT NULL,
    `executedCommand` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `transaction_username_idx`(`username`),
    INDEX `transaction_itemId_idx`(`itemId`),
    INDEX `transaction_serverId_idx`(`serverId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `topup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` MEDIUMINT UNSIGNED NOT NULL,
    `amount` DOUBLE NOT NULL,
    `pointsAdded` INTEGER NOT NULL,
    `channel` ENUM('TRUEWALLET', 'BANK') NOT NULL,
    `status` ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'SUCCESS',
    `reference` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `topup_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `playerpoints_migrations` (
    `migration_version` INTEGER NOT NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `playerpoints_points` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(36) NOT NULL,
    `points` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `uuid`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `playerpoints_transaction_log` (
    `transaction_type` VARCHAR(20) NOT NULL,
    `description` VARCHAR(100) NOT NULL,
    `source` VARCHAR(36) NULL,
    `receiver` VARCHAR(36) NOT NULL,
    `amount` INTEGER NOT NULL,
    `timestamp` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `playerpoints_username_cache` (
    `uuid` VARCHAR(36) NOT NULL,
    `username` VARCHAR(30) NOT NULL,

    UNIQUE INDEX `uuid`(`uuid`),
    INDEX `playerpoints_username_cache_username_index`(`username`),
    INDEX `playerpoints_username_cache_uuid_index`(`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `setting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `siteName` VARCHAR(255) NOT NULL,
    `siteDesc` TEXT NULL,
    `logo` VARCHAR(255) NULL,
    `serverIp` VARCHAR(15) NOT NULL,
    `serverImageUrl` VARCHAR(255) NULL,
    `serverName` VARCHAR(255) NOT NULL,
    `serverDesc` TEXT NULL,
    `pointMultiplier` DOUBLE NOT NULL DEFAULT 1,
    `enableTruewallet` BOOLEAN NOT NULL DEFAULT false,
    `enableBank` BOOLEAN NOT NULL DEFAULT false,
    `easyslipApiKey` VARCHAR(255) NULL,
    `truewalletPhoneNumber` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `banner` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `imageUrl` VARCHAR(255) NOT NULL,
    `link` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
