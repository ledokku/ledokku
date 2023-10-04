/*
  Warnings:

  - You are about to drop the column `modelId` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `redirectUrl` on the `Activity` table. All the data in the column will be lost.
  - The `refersToModel` column on the `Activity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `modifierId` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ModelReferences" AS ENUM ('Database', 'App', 'AppBuild');

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "modelId",
DROP COLUMN "redirectUrl",
ADD COLUMN     "modifierId" TEXT NOT NULL,
ADD COLUMN     "referenceId" TEXT,
DROP COLUMN "refersToModel",
ADD COLUMN     "refersToModel" "ModelReferences";

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "database_activity" FOREIGN KEY ("referenceId") REFERENCES "Database"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "app_activity" FOREIGN KEY ("referenceId") REFERENCES "App"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "app_build_activity" FOREIGN KEY ("referenceId") REFERENCES "AppBuild"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_modifierId_fkey" FOREIGN KEY ("modifierId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
