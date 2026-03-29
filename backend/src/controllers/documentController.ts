import { Request, Response, NextFunction } from 'express';
import {
  createDocument,
  getAllDocuments,
  getDocumentById,
  createSummary,
  saveQuery,
  getQueryHistory,
  deleteDocumentService,
} from '../services/documentService';
import {
  extractTextFromFile,
  summarizeDocument,
  answerQuestion,
} from '../services/geminiService';
import { AskQuestionBody, AuthRequest } from '../types';
import { checkAndIncrementQuestion, checkAndIncrementUpload } from '../services/usageservice';


// ─────────────────────────────────────────────────────────────
//  UPLOAD DOCUMENT
// ─────────────────────────────────────────────────────────────

export const uploadDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ success: false, error: 'No file uploaded' });
      return;
    }

    await checkAndIncrementUpload(userId);

    const { originalname, path: filePath, mimetype, size } = req.file;

    // Save document record to DB
    const document = await createDocument(originalname, filePath, mimetype, size, userId);

    // Extract text and generate summary
    const content = await extractTextFromFile(filePath, mimetype);
    const summaryText = await summarizeDocument(content, originalname);
    const summary = await createSummary(document.id, summaryText);

    res.status(201).json({
      success: true,
      data: { document, summary },
    });
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

// ─────────────────────────────────────────────────────────────
//  DOCUMENT LIST
// ─────────────────────────────────────────────────────────────
  
export const listDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {

    const userId = (req as AuthRequest).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 6); // default 6

    const { documents, total } = await getAllDocuments(page, limit, userId);

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

// ─────────────────────────────────────────────────────────────
// GET DOCUMENT BY ID
// ─────────────────────────────────────────────────────────────
export const getDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const document = await getDocumentById(req.params.id, userId);
    if (!document) {
      res.status(404).json({ success: false, error: 'Document not found' });
      return;
    }
    res.json({ success: true, data: document });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE DOCUMENT BY ID
// ─────────────────────────────────────────────────────────────

export const deleteDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as AuthRequest).user?.id;
        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const result = await deleteDocumentService(req.params.id, userId);

        if(!result){
           return res.status(404).json({success: result, message: "Document not found"});
        }
         return res.status(200).json({success: result, message: "Document deleted successfully"}); 
       
    } catch (err: any) {
        next(err); // Pass to global error handler
    }
};


// ─────────────────────────────────────────────────────────────
//  ASK QUESTION
// ─────────────────────────────────────────────────────────────
export const askQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { document_id, question } = req.body as AskQuestionBody;
    // console.log("question and id:", question, " ", document_id);

    if (!document_id || !question) {
      res.status(400).json({ success: false, error: 'document_id and question are required' });
      return;
    }

    await checkAndIncrementQuestion(userId);

    const document = await getDocumentById(document_id, userId);
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

// ─────────────────────────────────────────────────────────────
//  GET HISTORY BY ID
// ─────────────────────────────────────────────────────────────
export const getHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const history = await getQueryHistory(req.params.document_id, userId);

    if (history === null) {
      res.status(404).json({ success: false, error: 'Document not found' });
      return;
    }

    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};
