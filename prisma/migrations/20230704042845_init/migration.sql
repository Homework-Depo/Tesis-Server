/*
  Warnings:

  - Added the required column `address` to the `OfficeBranch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `OfficeBranch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OfficeBranch" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;
