import { Request } from "express";
export interface Document {
  id: string;
  filename: string;
  file_path: string;
  file_type: string;
  size_bytes: number;
  created_at: Date;
}

export interface Summary {
  id: string;
  document_id: string;
  summary_text: string;
  created_at: Date;
}

export interface Query {
  id: string;
  document_id: string;
  question: string;
  answer: string;
  asked_at: Date;
}

export interface DocumentWithSummary extends Document {
  summary: Summary | null;
}

export interface AskQuestionBody {
  document_id: string;
  question: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}


// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}
