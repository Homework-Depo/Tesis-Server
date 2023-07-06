/*
  Warnings:

  - You are about to drop the column `name` on the `CourtFile` table. All the data in the column will be lost.
  - Added the required column `court` to the `CourtFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CourtFile" DROP COLUMN "name",
ADD COLUMN     "court" TEXT NOT NULL;
