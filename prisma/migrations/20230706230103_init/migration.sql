/*
  Warnings:

  - You are about to drop the `_CaseToLawMatter` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `lawMatterId` to the `Case` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CaseToLawMatter" DROP CONSTRAINT "_CaseToLawMatter_A_fkey";

-- DropForeignKey
ALTER TABLE "_CaseToLawMatter" DROP CONSTRAINT "_CaseToLawMatter_B_fkey";

-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "lawMatterId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_CaseToLawMatter";

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_lawMatterId_fkey" FOREIGN KEY ("lawMatterId") REFERENCES "LawMatter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
