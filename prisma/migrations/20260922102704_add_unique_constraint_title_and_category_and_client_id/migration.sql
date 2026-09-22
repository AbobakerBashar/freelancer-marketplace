/*
  Warnings:

  - A unique constraint covering the columns `[title,clientId,category]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Project_title_clientId_category_key" ON "Project"("title", "clientId", "category");
