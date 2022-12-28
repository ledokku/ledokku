-- CreateEnum
CREATE TYPE "AppStatus" AS ENUM ('RUNNING', 'BUILDING', 'IDLE');

-- AlterTable
ALTER TABLE "App" ADD COLUMN     "status" "AppStatus" NOT NULL DEFAULT 'IDLE';
