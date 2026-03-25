import { prisma } from '../config/db';

export const createDocument = async (
  filename: string,
  filePath: string,
  fileType: string,
  sizeBytes: number
) => {
  return await prisma.document.create({
    data: { filename, filePath, fileType, sizeBytes }
  });
};

// documents.service.ts
export const getAllDocuments = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [documents, total] = await Promise.all([
    prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
      include: { summaries: true },
      skip,
      take: limit,
    }),
    prisma.document.count(),
  ]);

  return { documents, total };
};

export const getDocumentById = async (id: string) => {
  return await prisma.document.findUnique({
    where: { id },
    include: { summaries: true, queries: true }
  });
};

export const createSummary = async (
  documentId: string,
  summaryText: string
) => {
  return await prisma.summary.create({
    data: { documentId, summaryText }
  });
};

export const saveQuery = async (
  documentId: string,
  question: string,
  answer: string
) => {
  return await prisma.query.create({
    data: { documentId, question, answer }
  });
};

export const getQueryHistory = async (documentId: string) => {
  return await prisma.query.findMany({
    where: { documentId },
    orderBy: { askedAt: 'asc' }
  });
};