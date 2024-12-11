-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(50) NOT NULL,
    `lastName` VARCHAR(50) NOT NULL,
    `birthDate` DATETIME(3) NOT NULL,
    `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
    `role` ENUM('Fan', 'Manager', 'Admin') NOT NULL,
    `City` VARCHAR(191) NOT NULL,
    `Address` VARCHAR(191) NULL,
    `emailAddress` VARCHAR(191) NOT NULL,
    `tokens` JSON NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_emailAddress_key`(`emailAddress`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Match` (
    `id` VARCHAR(191) NOT NULL,
    `HomeTeam` VARCHAR(191) NOT NULL,
    `AwayTeam` VARCHAR(191) NOT NULL,
    `date_time` DATETIME(3) NOT NULL,
    `Refree` VARCHAR(191) NOT NULL,
    `linesman1` VARCHAR(191) NOT NULL,
    `linesman2` VARCHAR(191) NOT NULL,
    `stadiumId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Match_date_time_stadiumId_key`(`date_time`, `stadiumId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Stadium` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `vipRows` INTEGER NOT NULL,
    `vipSeatsPerRow` INTEGER NOT NULL,

    UNIQUE INDEX `Stadium_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Seat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rowNumber` INTEGER NOT NULL,
    `seatNumber` INTEGER NOT NULL,
    `stadiumid` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ticket` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reservedAt` DATETIME(3) NOT NULL,
    `matchid` VARCHAR(191) NOT NULL,
    `seatid` INTEGER NOT NULL,
    `userid` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Ticket_seatid_matchid_key`(`seatid`, `matchid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_stadiumId_fkey` FOREIGN KEY (`stadiumId`) REFERENCES `Stadium`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Seat` ADD CONSTRAINT `Seat_stadiumid_fkey` FOREIGN KEY (`stadiumid`) REFERENCES `Stadium`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_matchid_fkey` FOREIGN KEY (`matchid`) REFERENCES `Match`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_seatid_fkey` FOREIGN KEY (`seatid`) REFERENCES `Seat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
