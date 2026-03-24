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
} from '../services/anthropicService';
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
    console.log("req:",req.file);
    
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
  } catch (error) {
    console.log("Error in next:",error);
    
    next(error);
  }
};

// GET /api/documents
export const listDocuments = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const documents = await getAllDocuments();
    res.json({ success: true, data: documents });
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
    const answer = await answerQuestion(content, question, document.filename);

    // Save Q&A to history
    const query = await saveQuery(document_id, question, answer);

    res.json({ success: true, data: { question, answer, query } });
  } catch (error) {
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
