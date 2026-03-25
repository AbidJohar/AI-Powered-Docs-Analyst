import { Request, Response, NextFunction } from 'express';
import {
  createDocument,
  getAllDocuments,
  getDocumentById,
  createSummary,
  saveQuery,
  getQueryHistory,
} from '../services/documentService';
import {
  extractTextFromFile,
  summarizeDocument,
  answerQuestion,
} from '../services/geminiService';
import { AskQuestionBody, ApiResponse } from '../types';

// POST /api/upload
export const uploadDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // console.log("req:",req);
  try {

    if (!req.file) {
      res.status(400).json({ success: false, error: 'No file uploaded' });
      return;
    }
    // console.log("req:",req.file);

    const { originalname, path: filePath, mimetype, size } = req.file;

    // Save document record to DB
    const document = await createDocument(originalname, filePath, mimetype, size);

    // Extract text and generate summary
    const content = await extractTextFromFile(filePath, mimetype);
    const summaryText = await summarizeDocument(content, originalname);
    const summary = await createSummary(document.id, summaryText);

    res.status(201).json({
      success: true,
      data: { document, summary },
    });
  } catch (error: any) {
    console.log("error:", error);

    if (error.code === 429) {
      res.status(429).json({
        success: false,
        // error: "rate_limit",
        message: error.message,
        // retryAfter: error.retryAfter ?? 36,
      });
      return;
    }

    next(error);
  }
};

// GET /api/documents
// documents.controller.ts
export const listDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 6); // default 6

    const { documents, total } = await getAllDocuments(page, limit);

    res.json({
      success: true,
      data: documents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/documents/:id
export const getDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const document = await getDocumentById(req.params.id);
    if (!document) {
      res.status(404).json({ success: false, error: 'Document not found' });
      return;
    }
    res.json({ success: true, data: document });
  } catch (error) {
    next(error);
  }
};

// POST /api/ask
export const askQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { document_id, question } = req.body as AskQuestionBody;
    // console.log("question and id:", question, " ", document_id);

    if (!document_id || !question) {
      res.status(400).json({ success: false, error: 'document_id and question are required' });
      return;
    }

    const document = await getDocumentById(document_id);
    if (!document) {
      res.status(404).json({ success: false, error: 'Document not found' });
      return;
    }


    // Re-extract text from saved file
    const content = await extractTextFromFile(document.filePath, document.fileType);
    // console.log("content:", content);

    const answer = await answerQuestion(content, question, document.filename);
    // console.log("Answer:", answer);

    // Save Q&A to history
    const query = await saveQuery(document_id, question, answer);

    res.json({ success: true, data: { question, answer, query } });
  } catch (error: any) {

    if (error.code === 429) {
      res.status(429).json({
        success: false,
        message: error.message,
        
      });
      return;
    }

    next(error);
  }
};

// GET /api/history/:document_id
export const getHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const history = await getQueryHistory(req.params.document_id);
    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};
