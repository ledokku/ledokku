# Migration `20200801143510`

This migration has been generated at 8/1/2020, 2:35:10 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."App" ALTER COLUMN "githubId" DROP NOT NULL,
ALTER COLUMN "githubRepoUrl" DROP NOT NULL;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200628123314-link-databases-to-app..20200801143510
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
@@ -25,10 +25,10 @@
   id            String     @default(uuid()) @id
   createdAt     DateTime   @default(now())
   updatedAt     DateTime   @default(now())
   name          String
-  githubRepoUrl String
-  githubId      String
+  githubRepoUrl String?
+  githubId      String?
   user          User       @relation(fields: [userId], references: [id])
   userId        String
   appBuild      AppBuild[]
   databases     Database[] @relation(references: [id])
```
