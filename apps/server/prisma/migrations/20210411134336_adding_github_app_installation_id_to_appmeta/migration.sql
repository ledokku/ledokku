/*
  Warnings:

  - Added the required column `githubAppInstallationId` to the `AppMetaGithub` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AppMetaGithub" ADD COLUMN     "githubAppInstallationId" TEXT NOT NULL;
