yarn run v1.22.21
$ C:\Users\tib\Documents\GitHub\orli-web\node_modules\.bin\prisma migrate diff --from-empty --to-schema-datamodel .\prisma\schema.prisma --script
-- CreateTable
CREATE TABLE `accomodation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` TIMESTAMP(0) NULL,
    `ownerContact` VARCHAR(32) NULL,
    `isOwner` TINYINT NULL DEFAULT 0,
    `roomId` INTEGER NULL,

    INDEX `fk_accomodation_room1_idx`(`roomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attendee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(35) NOT NULL,
    `lastName` VARCHAR(35) NOT NULL,
    `email` VARCHAR(256) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `dateOfBirth` DATE NOT NULL,
    `phone` INTEGER NULL,
    `telegram` VARCHAR(32) NULL,
    `allergy` VARCHAR(1024) NULL,
    `registeredAt` TIMESTAMP(0) NULL,
    `verified` TINYINT NOT NULL,
    `admin` TINYINT NOT NULL,
    `staff` TINYINT NOT NULL,
    `fursonaId` INTEGER NOT NULL,
    `nationalityId` INTEGER NOT NULL,
    `accomodationId` INTEGER NULL,
    `passwordResetTokenId` INTEGER NULL,
    `ticketId` INTEGER NULL,

    UNIQUE INDEX `fursonaId_UNIQUE`(`fursonaId`),
    INDEX `fk_attendee_accomodation1_idx`(`accomodationId`),
    INDEX `fk_attendee_fursona_idx`(`fursonaId`),
    INDEX `fk_attendee_nationality1_idx`(`nationalityId`),
    INDEX `fk_attendee_passwordResetToken1_idx`(`passwordResetTokenId`),
    INDEX `fk_attendee_ticket1_idx`(`ticketId`),
    PRIMARY KEY (`id`, `nationalityId`, `fursonaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fursona` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(10) NOT NULL,
    `species` VARCHAR(10) NOT NULL,
    `pathToPictureFile` VARCHAR(255) NOT NULL,
    `hasFursuit` TINYINT NOT NULL DEFAULT 0,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nationality` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `iso2` VARCHAR(2) NOT NULL,
    `iso3` VARCHAR(3) NOT NULL,
    `countryNameEnglish` VARCHAR(64) NOT NULL,
    `countryNameHungarian` VARCHAR(64) NOT NULL,
    `phoneCode` VARCHAR(32) NOT NULL,
    `timezone` VARCHAR(64) NOT NULL,
    `currency` VARCHAR(24) NOT NULL,
    `languageCodes` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `passwordresettoken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(255) NOT NULL,
    `tokenExpireTime` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `room` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `building` ENUM('F├íc├ín', 'Vidra', 'K├│csag', '') NOT NULL,
    `number` VARCHAR(15) NOT NULL,
    `size` INTEGER NOT NULL,
    `customName` VARCHAR(20) NULL,
    `pin` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(64) NOT NULL DEFAULT 'Normal',
    `earlyArrival` TINYINT NOT NULL DEFAULT 0,
    `lateDeparture` TINYINT NOT NULL DEFAULT 0,
    `sponsorLevel` ENUM('None', 'Regular', 'Super') NOT NULL DEFAULT 'None',
    `shirtSize` ENUM('S', 'M', 'L', 'XL', 'XXL', 'XXXL') NULL,
    `sponsorPrice` INTEGER NOT NULL,
    `totalPrice` INTEGER NOT NULL,
    `paymentMethod` ENUM('MKB', 'PayPal', 'Revolut', '') NULL,
    `isPaid` TINYINT NOT NULL DEFAULT 0,
    `foodData` JSON NULL,
    `arrivalDate` DATE NOT NULL,
    `departureDate` DATE NOT NULL,
    `createdAt` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `accomodation` ADD CONSTRAINT `fk_accomodation_room1` FOREIGN KEY (`roomId`) REFERENCES `room`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `attendee` ADD CONSTRAINT `fk_attendee_accomodation1` FOREIGN KEY (`accomodationId`) REFERENCES `accomodation`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `attendee` ADD CONSTRAINT `fk_attendee_fursona` FOREIGN KEY (`fursonaId`) REFERENCES `fursona`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `attendee` ADD CONSTRAINT `fk_attendee_nationality1` FOREIGN KEY (`nationalityId`) REFERENCES `nationality`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `attendee` ADD CONSTRAINT `fk_attendee_passwordResetToken1` FOREIGN KEY (`passwordResetTokenId`) REFERENCES `passwordresettoken`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `attendee` ADD CONSTRAINT `fk_attendee_ticket1` FOREIGN KEY (`ticketId`) REFERENCES `ticket`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

Done in 0.50s.
