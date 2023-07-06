/*
  Warnings:

  - You are about to drop the column `matterId` on the `LawBranch` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `LawBranch` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LawBranch" DROP CONSTRAINT "LawBranch_matterId_fkey";

-- AlterTable
ALTER TABLE "LawBranch" DROP COLUMN "matterId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "_LawBranchToMatter" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LawBranchToMatter_AB_unique" ON "_LawBranchToMatter"("A", "B");

-- CreateIndex
CREATE INDEX "_LawBranchToMatter_B_index" ON "_LawBranchToMatter"("B");

-- AddForeignKey
ALTER TABLE "_LawBranchToMatter" ADD CONSTRAINT "_LawBranchToMatter_A_fkey" FOREIGN KEY ("A") REFERENCES "LawBranch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LawBranchToMatter" ADD CONSTRAINT "_LawBranchToMatter_B_fkey" FOREIGN KEY ("B") REFERENCES "Matter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
