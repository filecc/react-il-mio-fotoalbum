/*
  Warnings:

  - Added the required column `link` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Photo` ADD COLUMN `link` VARCHAR(255) NOT NULL;
