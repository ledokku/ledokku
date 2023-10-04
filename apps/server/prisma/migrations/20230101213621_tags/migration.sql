-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AppToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DatabaseToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_AppToTag_AB_unique" ON "_AppToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_AppToTag_B_index" ON "_AppToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DatabaseToTag_AB_unique" ON "_DatabaseToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_DatabaseToTag_B_index" ON "_DatabaseToTag"("B");

-- AddForeignKey
ALTER TABLE "_AppToTag" ADD CONSTRAINT "_AppToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppToTag" ADD CONSTRAINT "_AppToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DatabaseToTag" ADD CONSTRAINT "_DatabaseToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Database"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DatabaseToTag" ADD CONSTRAINT "_DatabaseToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
