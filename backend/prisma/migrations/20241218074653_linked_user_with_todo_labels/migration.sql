/*
  Warnings:

  - Added the required column `userId` to the `Label` table without a default value. This is not possible if the table is not empty.
  - Added the required column `labelId` to the `Todo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Label" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "labelId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Label" ADD CONSTRAINT "Label_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
