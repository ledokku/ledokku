-- DropForeignKey
ALTER TABLE "AppBuild" DROP CONSTRAINT "AppBuild_appId_fkey";

-- AddForeignKey
ALTER TABLE "AppBuild" ADD CONSTRAINT "AppBuild_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "AppMetaGithub_appId_unique" RENAME TO "AppMetaGithub_appId_key";

-- RenameIndex
ALTER INDEX "User.githubId_unique" RENAME TO "User_githubId_key";

-- RenameIndex
ALTER INDEX "User.username_unique" RENAME TO "User_username_key";
