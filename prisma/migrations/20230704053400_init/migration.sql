/*
  Warnings:

  - You are about to drop the column `matterId` on the `CourtFile` table. All the data in the column will be lost.
  - You are about to drop the column `matterId` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `matterId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the `Matter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LawMatterToMatter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MatterToOfficeBranch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MatterToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[caseId]` on the table `CourtFile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `caseId` to the `CourtFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `caseId` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `caseId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CourtFile" DROP CONSTRAINT "CourtFile_matterId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_matterId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_matterId_fkey";

-- DropForeignKey
ALTER TABLE "Matter" DROP CONSTRAINT "Matter_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Matter" DROP CONSTRAINT "Matter_lawBranchId_fkey";

-- DropForeignKey
ALTER TABLE "_LawMatterToMatter" DROP CONSTRAINT "_LawMatterToMatter_A_fkey";

-- DropForeignKey
ALTER TABLE "_LawMatterToMatter" DROP CONSTRAINT "_LawMatterToMatter_B_fkey";

-- DropForeignKey
ALTER TABLE "_MatterToOfficeBranch" DROP CONSTRAINT "_MatterToOfficeBranch_A_fkey";

-- DropForeignKey
ALTER TABLE "_MatterToOfficeBranch" DROP CONSTRAINT "_MatterToOfficeBranch_B_fkey";

-- DropForeignKey
ALTER TABLE "_MatterToUser" DROP CONSTRAINT "_MatterToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_MatterToUser" DROP CONSTRAINT "_MatterToUser_B_fkey";

-- DropIndex
DROP INDEX "CourtFile_matterId_key";

-- AlterTable
ALTER TABLE "CourtFile" DROP COLUMN "matterId",
ADD COLUMN     "caseId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "matterId",
ADD COLUMN     "caseId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "File" DROP COLUMN "matterId",
ADD COLUMN     "caseId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Matter";

-- DropTable
DROP TABLE "_LawMatterToMatter";

-- DropTable
DROP TABLE "_MatterToOfficeBranch";

-- DropTable
DROP TABLE "_MatterToUser";

-- CreateTable
CREATE TABLE "Case" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "clientId" INTEGER NOT NULL,
    "lawBranchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CaseToOfficeBranch" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CaseToLawMatter" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CaseToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CaseToOfficeBranch_AB_unique" ON "_CaseToOfficeBranch"("A", "B");

-- CreateIndex
CREATE INDEX "_CaseToOfficeBranch_B_index" ON "_CaseToOfficeBranch"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CaseToLawMatter_AB_unique" ON "_CaseToLawMatter"("A", "B");

-- CreateIndex
CREATE INDEX "_CaseToLawMatter_B_index" ON "_CaseToLawMatter"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CaseToUser_AB_unique" ON "_CaseToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_CaseToUser_B_index" ON "_CaseToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "CourtFile_caseId_key" ON "CourtFile"("caseId");

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_lawBranchId_fkey" FOREIGN KEY ("lawBranchId") REFERENCES "LawBranch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourtFile" ADD CONSTRAINT "CourtFile_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaseToOfficeBranch" ADD CONSTRAINT "_CaseToOfficeBranch_A_fkey" FOREIGN KEY ("A") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaseToOfficeBranch" ADD CONSTRAINT "_CaseToOfficeBranch_B_fkey" FOREIGN KEY ("B") REFERENCES "OfficeBranch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaseToLawMatter" ADD CONSTRAINT "_CaseToLawMatter_A_fkey" FOREIGN KEY ("A") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaseToLawMatter" ADD CONSTRAINT "_CaseToLawMatter_B_fkey" FOREIGN KEY ("B") REFERENCES "LawMatter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaseToUser" ADD CONSTRAINT "_CaseToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaseToUser" ADD CONSTRAINT "_CaseToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
