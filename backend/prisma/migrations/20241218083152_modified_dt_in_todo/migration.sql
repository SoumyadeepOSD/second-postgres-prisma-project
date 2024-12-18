/*
  Warnings:

  - You are about to drop the column `dateTime` on the `Todo` table. All the data in the column will be lost.
  - Added the required column `creationDateTime` to the `Todo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updationDateTime` to the `Todo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "dateTime",
ADD COLUMN     "creationDateTime" TEXT NOT NULL,
ADD COLUMN     "updationDateTime" TEXT NOT NULL;
