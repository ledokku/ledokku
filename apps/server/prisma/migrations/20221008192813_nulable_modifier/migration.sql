-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_modifierId_fkey";

-- AlterTable
ALTER TABLE "Activity" ALTER COLUMN "modifierId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_modifierId_fkey" FOREIGN KEY ("modifierId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
