# Migration `20201106104236-unlink-user`

This migration has been generated at 11/6/2020, 10:42:36 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."App" ALTER COLUMN "userId" DROP NOT NULL

ALTER TABLE "public"."AppBuild" ALTER COLUMN "userId" DROP NOT NULL

ALTER TABLE "public"."Database" ALTER COLUMN "userId" DROP NOT NULL

ALTER INDEX "public"."User.githubId" RENAME TO "User.githubId_unique"

ALTER INDEX "public"."User.username" RENAME TO "User.username_unique"
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200912135606-remove-github-fields..20201106104236-unlink-user
--- datamodel.dml
+++ datamodel.dml
@@ -1,7 +1,7 @@
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -25,10 +25,8 @@
   id            String     @default(uuid()) @id
   createdAt     DateTime   @default(now())
   updatedAt     DateTime   @default(now())
   name          String
-  user          User       @relation(fields: [userId], references: [id])
-  userId        String
   appBuild      AppBuild[]
   databases     Database[] @relation(references: [id])
 }
@@ -38,10 +36,8 @@
   updatedAt DateTime       @default(now())
   status    AppBuildStatus
   app       App            @relation(fields: [appId], references: [id])
   appId     String
-  user      User           @relation(fields: [userId], references: [id])
-  userId    String
 }
 enum AppBuildStatus {
   PENDING
@@ -55,12 +51,9 @@
   createdAt DateTime @default(now())
   updatedAt DateTime @default(now())
   name      String
   type      DbTypes
-  user      User     @relation(fields: [userId], references: [id])
-  userId    String
   apps      App[]    @relation(references: [id])
-
 }
 enum DbTypes {
   REDIS
```
