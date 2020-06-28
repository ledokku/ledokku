# Migration `20200628123314-link-databases-to-app`

This migration has been generated at 6/28/2020, 12:33:14 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."_AppToDatabase" (
"A" text  NOT NULL ,"B" text  NOT NULL )

CREATE UNIQUE INDEX "_AppToDatabase_AB_unique" ON "public"."_AppToDatabase"("A","B")

CREATE  INDEX "_AppToDatabase_B_index" ON "public"."_AppToDatabase"("B")

ALTER TABLE "public"."_AppToDatabase" ADD FOREIGN KEY ("A")REFERENCES "public"."App"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."_AppToDatabase" ADD FOREIGN KEY ("B")REFERENCES "public"."Database"("id") ON DELETE CASCADE  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200510152117-init..20200628123314-link-databases-to-app
--- datamodel.dml
+++ datamodel.dml
@@ -1,25 +1,25 @@
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = env("DATABASE_URL")
 }
 generator client {
   provider = "prisma-client-js"
 }
 model User {
-  id                      String     @default(uuid()) @id
-  createdAt               DateTime   @default(now())
-  updatedAt               DateTime   @default(now())
-  username                String     @unique
-  avatarUrl               String
-  email                   String
-  githubId                String     @unique
-  githubAccessToken       String
-  App                     App[]
-  Database                Database[]
-  AppBuild                AppBuild[]
+  id                String     @default(uuid()) @id
+  createdAt         DateTime   @default(now())
+  updatedAt         DateTime   @default(now())
+  username          String     @unique
+  avatarUrl         String
+  email             String
+  githubId          String     @unique
+  githubAccessToken String
+  App               App[]
+  Database          Database[]
+  AppBuild          AppBuild[]
 }
 model App {
   id            String     @default(uuid()) @id
@@ -30,8 +30,9 @@
   githubId      String
   user          User       @relation(fields: [userId], references: [id])
   userId        String
   appBuild      AppBuild[]
+  databases     Database[] @relation(references: [id])
 }
 model AppBuild {
   id        String         @default(uuid()) @id
@@ -58,12 +59,14 @@
   name      String
   type      DbTypes
   user      User     @relation(fields: [userId], references: [id])
   userId    String
+  apps      App[]    @relation(references: [id])
+
 }
 enum DbTypes {
   REDIS
   POSTGRESQL
   MONGODB
   MYSQL
-}
+}
```
