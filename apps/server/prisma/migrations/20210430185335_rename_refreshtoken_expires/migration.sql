/*
  Warnings:

  - You are about to drop the column `refreshTokenExpiresIn` on the `User` table. All the data in the column will be lost.
  - Added the required column `refreshTokenExpiresAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "refreshTokenExpiresIn",
ADD COLUMN     "refreshTokenExpiresAt" TIMESTAMP(3) NOT NULL;
