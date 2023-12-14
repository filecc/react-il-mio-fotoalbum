/*
  Warnings:

  - Added the required column `authorId` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Photo` DROP FOREIGN KEY `Photo_id_fkey`;

-- AlterTable
ALTER TABLE `Photo` ADD COLUMN `authorId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Photo` ADD CONSTRAINT `Photo_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
