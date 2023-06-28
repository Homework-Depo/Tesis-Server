/*
  Warnings:

  - You are about to drop the `_MatterUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dni` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_MatterUser" DROP CONSTRAINT "_MatterUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_MatterUser" DROP CONSTRAINT "_MatterUser_B_fkey";

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "dni" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;

-- DropTable
DROP TABLE "_MatterUser";

-- CreateTable
CREATE TABLE "_ClientToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MatterToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClientToUser_AB_unique" ON "_ClientToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ClientToUser_B_index" ON "_ClientToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MatterToUser_AB_unique" ON "_MatterToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MatterToUser_B_index" ON "_MatterToUser"("B");

-- AddForeignKey
ALTER TABLE "_ClientToUser" ADD CONSTRAINT "_ClientToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientToUser" ADD CONSTRAINT "_ClientToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MatterToUser" ADD CONSTRAINT "_MatterToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Matter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MatterToUser" ADD CONSTRAINT "_MatterToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
