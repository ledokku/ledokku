# Migration `20200530212153-datetime-changed-to-string`

This migration has been generated at 5/30/2020, 9:21:53 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Database" DROP COLUMN "createdAt",
ADD COLUMN "createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "updatedAt",
ADD COLUMN "updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200510152117-init..20200530212153-datetime-changed-to-string
--- datamodel.dml
+++ datamodel.dml
@@ -1,31 +1,31 @@
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
-  createdAt     DateTime   @default(now())
-  updatedAt     DateTime   @default(now())
+  createdAt     String
+  updatedAt     String
   name          String
   githubRepoUrl String
   githubId      String
   user          User       @relation(fields: [userId], references: [id])
@@ -34,10 +34,10 @@
 }
 model AppBuild {
   id        String         @default(uuid()) @id
-  createdAt DateTime       @default(now())
-  updatedAt DateTime       @default(now())
+  createdAt String
+  updatedAt String
   status    AppBuildStatus
   app       App            @relation(fields: [appId], references: [id])
   appId     String
   user      User           @relation(fields: [userId], references: [id])
@@ -65,5 +65,5 @@
   REDIS
   POSTGRESQL
   MONGODB
   MYSQL
-}
+}
```
