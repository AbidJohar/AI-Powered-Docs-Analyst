-- CreateTable
CREATE TABLE "usage_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "uploadCount" INTEGER NOT NULL DEFAULT 0,
    "questionCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usage_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "usage_logs_userId_idx" ON "usage_logs"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "usage_logs_userId_date_key" ON "usage_logs"("userId", "date");

-- AddForeignKey
ALTER TABLE "usage_logs" ADD CONSTRAINT "usage_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
