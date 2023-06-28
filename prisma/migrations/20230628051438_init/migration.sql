/*
  Warnings:

  - Added the required column `branch` to the `Matter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Matter" ADD COLUMN     "branch" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastName" TEXT NOT NULL;
