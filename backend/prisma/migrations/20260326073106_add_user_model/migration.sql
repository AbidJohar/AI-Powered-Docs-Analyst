/*
  Warnings:

  - Added the required column `userId` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "googleId" TEXT NOT NULL,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE INDEX "documents_userId_idx" ON "documents"("userId");

-- CreateIndex
CREATE INDEX "queries_documentId_idx" ON "queries"("documentId");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
