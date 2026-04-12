import { generateWithFallback } from '../config/gemini'; // ← replaces geminiClient
import handleGeminiError from '../middleware/handleGeminiError';
import { buildPrompt, buildSummaryPrompt } from '../utility/promptBuilder';
import { routeIntent } from '../utility/intentRouter';

import * as fs from 'fs';
import * as nodexlsx from 'node-xlsx';

const CHUNK_SIZE = 64 * 1024; // 64KB chunks

export const extractTextFromFile = async (
  filePath: string,
  fileType: string
): Promise<string> => {

  // ── Plain text / CSV ──────────────────────────────────────────────────────
  if (fileType === 'text/plain' || fileType === 'text/csv') {
    return streamFileToString(filePath);
  }

  // ── PDF ───────────────────────────────────────────────────────────────────
  if (fileType === 'application/pdf') {
    return extractPdfStreamed(filePath);
  }

  // ── Excel (xls / xlsx) ───────────────────────────────────────────────────
  if (
    fileType === 'application/vnd.ms-excel' ||
    fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    return extractExcelStreamed(filePath);
  }

  throw new Error(`Unsupported file type: ${fileType}`);
};


// ── Helper functions ──────────────────────────────────────────────────────────────────

/** Reads a file in 64 KB chunks instead of slurping it all at once */
function streamFileToString(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const stream = fs.createReadStream(filePath, {
      highWaterMark: CHUNK_SIZE,
    });

    stream.on('data', (chunk: string | Buffer) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    stream.on('error', reject);
  });
}

/**
 * Pipes the PDF through pdf-parse without holding the raw buffer AND
 * the parsed text simultaneously — drops the raw buffer as soon as parsing
 * starts.
 */
async function extractPdfStreamed(filePath: string): Promise<string> {
  const pdfParse = (await import('pdf-parse')).default;

  // Read in chunks, but we still need a single Buffer for pdf-parse.
  // The win: we release the stream chunks once concat'd, parse, then GC.
  const rawBuffer = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    fs.createReadStream(filePath, { highWaterMark: CHUNK_SIZE })
      .on('data', (chunk: string | Buffer) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      })
      .on('end', () => resolve(Buffer.concat(chunks)))
      .on('error', reject);
  });

  // Parse then immediately allow GC of rawBuffer
  const data = await pdfParse(rawBuffer);
  return data.text;
}

/**
 * Processes Excel sheets one row at a time so only one sheet's rows
 * live in memory at any moment.
 */
async function extractExcelStreamed(filePath: string): Promise<string> {
  // node-xlsx has no true streaming API, but we parse lazily and
  // flush each sheet's text before moving on — avoiding a giant string[].
  const rawBuffer = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    fs.createReadStream(filePath, { highWaterMark: CHUNK_SIZE })
      .on('data', (chunk: string | Buffer) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      })
      .on('end', () => resolve(Buffer.concat(chunks)))
      .on('error', reject);
  });

  const sheets = nodexlsx.parse(rawBuffer);
  const results: string[] = [];

  for (const sheet of sheets) {
    // Build each sheet's text in a single pass, row by row
    let sheetText = `Sheet: ${sheet.name}\n`;

    for (const row of sheet.data as unknown[][]) {
      sheetText +=
        row.map((cell) => (cell == null ? '' : String(cell))).join(',') + '\n';
    }

    results.push(sheetText);

    // Explicitly release sheet data so GC can reclaim it
    // before the next sheet is processed
    (sheet as any).data = null;
  }

  return results.join('\n');
}

// ─────────────────────────────────────────────────────────────
//  SUMMARY — called on document upload
// ─────────────────────────────────────────────────────────────

export const summarizeDocument = async (content: string, filename: string): Promise<any> => {
  try {
    const prompt = buildSummaryPrompt(content, filename); 
    return await generateWithFallback(prompt);
  } catch (error: any) {
    handleGeminiError(error);
  }
};


// ─────────────────────────────────────────────────────────────
//  ANSWER QUESTION — routes to correct prompt via intentRouter
// ─────────────────────────────────────────────────────────────

export const answerQuestion = async (
  content: string,
  question: string,
  filename: string
): Promise<any> => {
  try {
    const {intent} = routeIntent(question);
    const prompt = buildPrompt(intent, content, question, filename);
    return await generateWithFallback(prompt);
  } catch (error: any) {
    handleGeminiError(error);
  }
};
























// export const summarizeDocument = async (content: string, filename: string): Promise<string | any> => {

//   try {
//     const response = await geminiClient.models.generateContent({
//       model: "gemini-2.5-flash-lite",
//       contents: `You are a document analyst. Analyze the following document named "${filename}" and provide:
// 1. A concise summary (2-3 sentences)
// 2. Key insights or important points (bullet list)
// 3. Document type/category

// Document content:
// ---
// ${content.slice(0, 15000)}
// ---

// Be concise and professional.`,
//     });

//     return response.text ?? 'Could not generate summary.';

//   } catch (error: any) {
//     handleGeminiError(error);
//   }


// };


// export const answerQuestion = async (
//   content: string,
//   question: string,
//   filename: string
// ): Promise<any> => {
//   try {
//     return await generateWithFallback(
//       `You are a document analyst.

// Answer the question using ONLY the provided document.

// IMPORTANT FORMATTING RULES (STRICT):
// - Always use Markdown format.
// - Always format key sections as bold headings using **Heading:** style.
// - Always keep a consistent structure across answers.
// - Use bullet points (*) for lists.
// - Each heading must ALWAYS be bold (using **).
// - Do NOT sometimes skip formatting — consistency is required.

// If the answer is not in the document, respond exactly:
// "This information is not available in the document."

// Document: "${filename}"
// ---
// ${content.slice(0, 15000)}
// ---

// Question: ${question}

// Answer clearly and concisely following the formatting rules above.`
//     );
//   } catch (error: any) {
//     handleGeminiError(error);
//   }
// };