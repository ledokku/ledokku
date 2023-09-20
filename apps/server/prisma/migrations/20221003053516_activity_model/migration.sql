-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "refersToModel" TEXT,
    "modelId" TEXT,
    "redirectUrl" TEXT,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);
