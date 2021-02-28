# Migration `20210228143809-add-github-repo-id-to-app-model`

This migration has been generated at 2/28/2021, 2:38:09 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."App" ADD COLUMN "githubRepoId" text
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201106104236-unlink-user..20210228143809-add-github-repo-id-to-app-model
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
@@ -25,8 +25,9 @@
   id            String     @default(uuid()) @id
   createdAt     DateTime   @default(now())
   updatedAt     DateTime   @default(now())
   name          String
+  githubRepoId  String?
   appBuild      AppBuild[]
   databases     Database[] @relation(references: [id])
 }
```
