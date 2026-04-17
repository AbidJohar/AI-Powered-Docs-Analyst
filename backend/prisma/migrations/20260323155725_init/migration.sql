-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "summaries" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "summaryText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "queries" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "askedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "queries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "summaries" ADD CONSTRAINT "summaries_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "queries" ADD CONSTRAINT "queries_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
