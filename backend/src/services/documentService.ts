import { prisma } from '../config/db';

export const createDocument = async (
  filename: string,
  filePath: string,
  fileType: string,
  sizeBytes: number,
  userId: string
) => {
  return await prisma.document.create({
    data: { filename, filePath, fileType, sizeBytes, userId }
  });
};

// documents.service.ts
export const getAllDocuments = async (page: number, limit: number, userId: string) => {
  const skip = (page - 1) * limit;

  const [documents, total] = await Promise.all([
    prisma.document.findMany({
      where: { userId },   // ← only this user's docs
      orderBy: { createdAt: 'desc' },
      include: { summaries: true },
      skip,
      take: limit,
    }),
    prisma.document.count({
      where: { userId }
    }),
  ]);

  return { documents, total };
};

export const getDocumentById = async (id: string, userId: string) => {
  return await prisma.document.findUnique({
    where: { id, userId },
    include: { summaries: true, queries: true }
  });
};


export const deleteDocumentService = async (id: string, userId: string) => {
  const result = await prisma.document.deleteMany({
    where: { id, userId }
  });

  if (result.count === 0) {
    return null;
  }

  return true;
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

export const getQueryHistory = async (documentId: string, userId: string) => {
  // Verify doc belongs to user first
  const document = await prisma.document.findFirst({
    where: { id: documentId, userId },
  });

  if (!document) return null;

  return await prisma.query.findMany({
    where: { documentId },
    orderBy: { askedAt: 'asc' },
  });
};