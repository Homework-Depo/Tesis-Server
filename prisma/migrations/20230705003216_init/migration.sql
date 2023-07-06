/*
  Warnings:

  - Added the required column `code` to the `CourtFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CourtFile" ADD COLUMN     "code" TEXT NOT NULL;
