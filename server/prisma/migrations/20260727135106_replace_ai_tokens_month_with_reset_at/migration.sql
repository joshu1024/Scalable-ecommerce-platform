/*
  Warnings:

  - You are about to drop the column `aiTokensMonth` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "aiTokensMonth",
ADD COLUMN     "aiTokensResetAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
