import fs from 'fs';
import path from 'path';
import { geminiClient } from '../config/gemini';

// Extract raw text from uploaded file
export const extractTextFromFile = async (filePath: string, fileType: string): Promise<string> => {
  if (fileType === 'text/plain' || fileType === 'text/csv') {
    return fs.readFileSync(filePath, 'utf-8');
  }

  if (fileType === 'application/pdf') {
    // Dynamically import pdf-parse to avoid issues at startup
    const pdfParse = (await import('pdf-parse')).default;
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }

  throw new Error(`Unsupported file type: ${fileType}`);
};

// Summarize document content via Anthropic
export const summarizeDocument = async (content: string, filename: string): Promise<string> => {
  const response = await geminiClient.models.generateContent({
    model: "gemini-2.5-flash-lite",   
    contents: `You are a document analyst. Analyze the following document named "${filename}" and provide:
1. A concise summary (2-3 sentences)
2. Key insights or important points (bullet list)
3. Document type/category

Document content:
---
${content.slice(0, 15000)}
---

Be concise and professional.`,
  });

  return response.text ?? 'Could not generate summary.';
};


// Answer a question about the document
export const answerQuestion = async (
  content: string,
  question: string,
  filename: string
): Promise<string> => {
  const response = await geminiClient.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: `
You are a document analyst.

Answer the question using ONLY the provided document.

IMPORTANT FORMATTING RULES (STRICT):
- Always use Markdown format.
- Always format key sections as bold headings using **Heading:** style.
- Always keep a consistent structure across answers.
- Use bullet points (*) for lists.
- Each heading must ALWAYS be bold (using **).
- Do NOT sometimes skip formatting — consistency is required.

If the answer is not in the document, respond exactly:
"This information is not available in the document."

Document: "${filename}"
---
${content.slice(0, 500000)}
---

Question: ${question}

Answer clearly and concisely following the formatting rules above.
`,
  });

  return response.text ?? 'Could not generate an answer.';
};
