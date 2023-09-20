/*
  Warnings:

  - You are about to drop the column `webhooksSecret` on the `AppMetaGithub` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AppMetaGithub" DROP COLUMN "webhooksSecret";
