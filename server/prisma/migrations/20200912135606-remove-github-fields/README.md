# Migration `20200912135606-remove-github-fields`

This migration has been generated at 9/12/2020, 1:56:06 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."App" DROP COLUMN "githubRepoUrl",
DROP COLUMN "githubId";
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200628123314-link-databases-to-app..20200912135606-remove-github-fields
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
-  githubRepoUrl String
-  githubId      String
   user          User       @relation(fields: [userId], references: [id])
   userId        String
   appBuild      AppBuild[]
   databases     Database[] @relation(references: [id])
```
