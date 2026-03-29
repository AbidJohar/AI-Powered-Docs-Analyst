import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { upload } from '../middleware/upload';
import {
  uploadDocument,
  listDocuments,
  getDocument,
  askQuestion,
  getHistory,
  deleteDocument,
} from '../controllers/documentController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();


// ─────────────────────────────────────────────────────────────
//  DOCUMENTS ROUTES
// ─────────────────────────────────────────────────────────────



router.post('/upload', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  upload.single('document')(req, res, (err) => {
    console.log("Error while uploading:", err);

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
router.get('/documents', authMiddleware, listDocuments);

// Get a single document with its summary
router.get('/documents/:id', authMiddleware, getDocument);

// Delete a single document
router.delete('/documents/:id', authMiddleware, deleteDocument);
 
// ask question
router.post('/ask', authMiddleware, askQuestion);

// get history of the document questions
router.get('/history/:document_id', authMiddleware, getHistory);

export default router;
