import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { upload } from '../middleware/upload';
import {
  uploadDocument,
  listDocuments,
  getDocument,
  askQuestion,
  getHistory,
} from '../controllers/documentController';

const router = Router();

router.post('/upload', (req: Request, res: Response, next: NextFunction) => {
  upload.single('document')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Handles file size, too many files, etc.
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({
          success: false,
          error: 'File is too large. Maximum size is 10MB.'
        });
        return;
      }
      return res.status(400).json({ success: false, error: err.message });
    } else if (err) {
      // This catches your fileFilter rejection
      return res.status(400).json({ success: false, error: err.message });
    }
    next();
  });
}, uploadDocument);

// List all uploaded documents
router.get('/documents', listDocuments);

// Get a single document with its summary
router.get('/documents/:id', getDocument);

// Ask a question about a document
router.post('/ask', askQuestion);

// Get Q&A history for a document
router.get('/history/:document_id', getHistory);

export default router;
