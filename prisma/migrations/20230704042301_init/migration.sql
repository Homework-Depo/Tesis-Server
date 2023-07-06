/*
  Warnings:

  - You are about to drop the column `branch` on the `Matter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Matter" DROP COLUMN "branch";

-- CreateTable
CREATE TABLE "CourtFile" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "officer" TEXT NOT NULL,
    "judge" TEXT NOT NULL,
    "matterId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourtFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LawBranch" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "matterId" INTEGER,

    CONSTRAINT "LawBranch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LawMatter" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lawBranchId" INTEGER NOT NULL,
    "matterId" INTEGER,

    CONSTRAINT "LawMatter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficeBranch" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfficeBranch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MatterToOfficeBranch" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MatterToOfficeBranch_AB_unique" ON "_MatterToOfficeBranch"("A", "B");

-- CreateIndex
CREATE INDEX "_MatterToOfficeBranch_B_index" ON "_MatterToOfficeBranch"("B");

-- AddForeignKey
ALTER TABLE "CourtFile" ADD CONSTRAINT "CourtFile_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "Matter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LawBranch" ADD CONSTRAINT "LawBranch_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "Matter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LawMatter" ADD CONSTRAINT "LawMatter_lawBranchId_fkey" FOREIGN KEY ("lawBranchId") REFERENCES "LawBranch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LawMatter" ADD CONSTRAINT "LawMatter_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "Matter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MatterToOfficeBranch" ADD CONSTRAINT "_MatterToOfficeBranch_A_fkey" FOREIGN KEY ("A") REFERENCES "Matter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MatterToOfficeBranch" ADD CONSTRAINT "_MatterToOfficeBranch_B_fkey" FOREIGN KEY ("B") REFERENCES "OfficeBranch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
