/*
  Warnings:

  - You are about to drop the column `matterId` on the `LawMatter` table. All the data in the column will be lost.
  - You are about to drop the `_LawBranchToMatter` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[matterId]` on the table `CourtFile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lawBranchId` to the `Matter` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LawMatter" DROP CONSTRAINT "LawMatter_matterId_fkey";

-- DropForeignKey
ALTER TABLE "_LawBranchToMatter" DROP CONSTRAINT "_LawBranchToMatter_A_fkey";

-- DropForeignKey
ALTER TABLE "_LawBranchToMatter" DROP CONSTRAINT "_LawBranchToMatter_B_fkey";

-- AlterTable
ALTER TABLE "LawMatter" DROP COLUMN "matterId";

-- AlterTable
ALTER TABLE "Matter" ADD COLUMN     "lawBranchId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_LawBranchToMatter";

-- CreateTable
CREATE TABLE "_LawMatterToMatter" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LawMatterToMatter_AB_unique" ON "_LawMatterToMatter"("A", "B");

-- CreateIndex
CREATE INDEX "_LawMatterToMatter_B_index" ON "_LawMatterToMatter"("B");

-- CreateIndex
CREATE UNIQUE INDEX "CourtFile_matterId_key" ON "CourtFile"("matterId");

-- AddForeignKey
ALTER TABLE "Matter" ADD CONSTRAINT "Matter_lawBranchId_fkey" FOREIGN KEY ("lawBranchId") REFERENCES "LawBranch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LawMatterToMatter" ADD CONSTRAINT "_LawMatterToMatter_A_fkey" FOREIGN KEY ("A") REFERENCES "LawMatter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LawMatterToMatter" ADD CONSTRAINT "_LawMatterToMatter_B_fkey" FOREIGN KEY ("B") REFERENCES "Matter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
