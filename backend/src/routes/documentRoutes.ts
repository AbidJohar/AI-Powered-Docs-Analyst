import { Router } from 'express';
import { upload } from '../middleware/upload';
import {
  uploadDocument,
  listDocuments,
  getDocument,
  askQuestion,
  getHistory,
} from '../controllers/documentController';

const router = Router();

// Upload a document and auto-generate summary
router.post('/upload', upload.single('document'), uploadDocument);

// List all uploaded documents
router.get('/documents', listDocuments);

// Get a single document with its summary
router.get('/documents/:id', getDocument);

// Ask a question about a document
router.post('/ask', askQuestion);

// Get Q&A history for a document
router.get('/history/:document_id', getHistory);

export default router;
