/*
  Warnings:

  - You are about to drop the column `githubRepoId` on the `App` table. All the data in the column will be lost.
  - You are about to drop the column `githubWebhooksToken` on the `App` table. All the data in the column will be lost.
  - You are about to drop the column `githubBranch` on the `App` table. All the data in the column will be lost.
  - Added the required column `type` to the `App` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AppTypes" AS ENUM ('DOKKU', 'GITHUB', 'GITLAB', 'DOCKER');

-- AlterTable
ALTER TABLE "App" DROP COLUMN "githubRepoId",
DROP COLUMN "githubWebhooksToken",
DROP COLUMN "githubBranch",
ADD COLUMN     "type" "AppTypes" NOT NULL;

-- CreateTable
CREATE TABLE "AppMetaGithub" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "webhooksSecret" TEXT NOT NULL,
    "repoId" TEXT NOT NULL,
    "repoUrl" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppMetaGithub_appId_unique" ON "AppMetaGithub"("appId");

-- AddForeignKey
ALTER TABLE "AppMetaGithub" ADD FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;
