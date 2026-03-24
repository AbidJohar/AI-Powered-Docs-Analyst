# AI Document Analyst

An AI-powered document analysis API built with Node.js, TypeScript, Express, PostgreSQL, and the Anthropic API.

## Features
- Upload PDF, TXT, CSV documents
- Auto-generate AI summaries on upload
- Ask questions about any document
- Full Q&A history stored in PostgreSQL

## Project Structure

```
doc-analyst/
├── src/
│   ├── config/
│   │   ├── db.ts              # PostgreSQL connection + table init
│   │   └── anthropic.ts       # Anthropic client setup
│   ├── controllers/
│   │   └── documentController.ts  # Route handlers
│   ├── middleware/
│   │   ├── upload.ts          # Multer file upload config
│   │   └── errorHandler.ts    # Global error handler
│   ├── routes/
│   │   └── documentRoutes.ts  # All API routes
│   ├── services/
│   │   ├── documentService.ts # DB queries
│   │   └── anthropicService.ts # LLM summarize + Q&A
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   └── index.ts               # App entry point
├── uploads/                   # Uploaded files stored here
├── .env.example
├── package.json
└── tsconfig.json
```

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Fill in your ANTHROPIC_API_KEY and DATABASE_URL
```

### 3. Setup PostgreSQL
```bash
createdb doc_analyst
```

### 4. Run in development
```bash
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload document (multipart/form-data, field: `document`) |
| GET | `/api/documents` | List all documents |
| GET | `/api/documents/:id` | Get document + summary |
| POST | `/api/ask` | Ask a question `{ document_id, question }` |
| GET | `/api/history/:document_id` | Get Q&A history |
| GET | `/health` | Health check |

## Example Usage

```bash
# Upload a document
curl -X POST http://localhost:3000/api/upload \
  -F "document=@report.pdf"

# Ask a question
curl -X POST http://localhost:3000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"document_id": "your-doc-uuid", "question": "What are the key findings?"}'

# Get history
curl http://localhost:3000/api/history/your-doc-uuid
```
