/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('OWNER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Roles" NOT NULL;

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "allowedEmails" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
