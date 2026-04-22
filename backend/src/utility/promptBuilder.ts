// promptBuilder.ts
import { Intent, TeacherIntent, AnalystIntent } from "./intentRouter";

const MAX_MCQS = 15;
const MAX_QUESTIONS = 10;
const DEFAULT_COUNT = 5;

const WORD_TO_NUM: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
};

const CONTENT_LIMITS = {
  summary:         100000,
  mcq:             60000,
  questions:       60000,
  explain:         40000,
  compare:         50000,
  extract:         80000,
  general_teacher: 40000,
  general_analyst: 60000,
  summarize:       100000,
};

export const sliceContent = (content: string, limit: number): string =>
  content.slice(0, limit);

// ─────────────────────────────────────────────────────────────
//  LANGUAGE DETECTION
// ─────────────────────────────────────────────────────────────

type SupportedLanguage =
  | "Urdu"
  | "Arabic"
  | "Spanish"
  | "Chinese"
  | "English";

/**
 * Detects the language the user wants a response in.
 *
 * Strategy (in order):
 * 1. Explicit keyword in the question  e.g. "in urdu", "en español", "用中文"
 * 2. Script detection — Arabic/Urdu Unicode block, CJK block
 * 3. Fallback → English
 */
export const detectLanguage = (question: string): SupportedLanguage => {
  const q = question.toLowerCase();

  // ── 1. Explicit keyword matching ──────────────────────────
  const LANGUAGE_KEYWORDS: Record<SupportedLanguage, RegExp> = {
    Urdu:    /\b(urdu|اردو|in urdu|بالاردو)\b/i,
    Arabic:  /\b(arabic|عربي|عربى|in arabic|بالعربي|بالعربية)\b/i,
    Spanish: /\b(spanish|español|espanol|en español|en espanol|castellano)\b/i,
    Chinese: /\b(chinese|mandarin|中文|普通话|粤语|in chinese|用中文)\b/i,
    English: /\b(english|in english)\b/i,
  };

  for (const [lang, pattern] of Object.entries(LANGUAGE_KEYWORDS) as [SupportedLanguage, RegExp][]) {
    if (pattern.test(question)) return lang;
  }

  // ── 2. Script / Unicode block detection ───────────────────
  // Arabic script (covers both Arabic and Urdu written in Nastaliq/Naskh)
  // We check Urdu-specific characters first (ں ے ۓ ڈ ڑ ٹ پ چ ژ) to separate from pure Arabic
  const URDU_SPECIFIC   = /[\u06BA\u06BE\u06C1\u06C3\u0688\u0691\u0679\u067E\u0686\u0698]/;
  const ARABIC_SCRIPT   = /[\u0600-\u06FF\u0750-\u077F]/;
  const CJK_SCRIPT      = /[\u4E00-\u9FFF\u3400-\u4DBF]/;

  if (URDU_SPECIFIC.test(question))  return "Urdu";
  if (ARABIC_SCRIPT.test(question))  return "Arabic";
  if (CJK_SCRIPT.test(question))     return "Chinese";

  // ── 3. Fallback ───────────────────────────────────────────
  return "English";
};

/**
 * Builds the language instruction injected into every prompt.
 * When English, returns empty string (no instruction needed — default behavior).
 */
const languageRule = (lang: SupportedLanguage): string =>
  lang === "English"
    ? ""
    : `\n🌐 LANGUAGE INSTRUCTION (HIGHEST PRIORITY): You MUST write your ENTIRE response in ${lang}. ` +
      `This includes all headings, labels, explanations, bullet points, table content, and any other text. ` +
      `Do NOT mix in English unless quoting directly from the source document. ` +
      `If a technical term has no ${lang} equivalent, you may keep the original term but explain it in ${lang}.\n`;

// ─────────────────────────────────────────────────────────────
//  LEVENSHTEIN + COUNT EXTRACTION
// ─────────────────────────────────────────────────────────────

const levenshtein = (a: string, b: string): number => {
  const dp = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[a.length][b.length];
};

const fuzzyMatchNumber = (question: string): number | null => {
  const words = question.toLowerCase().split(/\s+/);
  for (const word of words) {
    for (const [numberWord, value] of Object.entries(WORD_TO_NUM)) {
      const tolerance = numberWord.length <= 4 ? 1 : 2;
      if (levenshtein(word, numberWord) <= tolerance) return value;
    }
  }
  return null;
};

export const extractCount = (question: string, max: number): number => {
  const q = question.toLowerCase();
  const digitMatch = q.match(/\b(\d+)\b/);
  if (digitMatch) return Math.min(parseInt(digitMatch[1]), max);
  const fuzzy = fuzzyMatchNumber(q);
  if (fuzzy !== null) return Math.min(fuzzy, max);
  return Math.min(DEFAULT_COUNT, max);
};

// ─────────────────────────────────────────────────────────────
//  SHARED RULES
// ─────────────────────────────────────────────────────────────

const SHARED_RULES = `
Critical rules (highest priority):
1. OUT OF SCOPE: ONLY say "This information is not available in the document." if the question 
   is about something completely unrelated to the document (e.g. sports scores on a chemistry doc).
   NEVER say this for: summarizing, listing points, key takeaways, important topics, extracting info,
   or ANY question that can be answered using the document content — even partially.
2. SHORT ANSWER: If the user asks for a short answer (e.g. "in 2 lines", "briefly", "in one sentence"),
   skip all formatting and respond only in that exact requested length.
3. ALWAYS use the document content to answer. When in doubt — answer from the document.
`;

// ─────────────────────────────────────────────────────────────
//  TEACHER PROMPTS
// ─────────────────────────────────────────────────────────────

const teacherMCQPrompt = (
  content: string,
  question: string,
  filename: string,
  lang: SupportedLanguage
): string => {
  const count = extractCount(question, MAX_MCQS);
  const langInstruction = languageRule(lang);

  const exampleFormat = [
    "**Q1. [Question text here]**",
    "",
    "A) [Option A]",
    "",
    "B) [Option B]",
    "",
    "C) [Option C]",
    "",
    "D) [Option D]",
    "",
    "✅ **Correct Answer: [Letter]) [Answer text]**",
    "💡 **Explanation:** [One sentence referencing the document]",
    "",
    "---",
    "",
    "**Q2. [Next question]**",
    "",
    "A) [Option A]",
    "",
    "B) [Option B]",
    "",
    "C) [Option C]",
    "",
    "D) [Option D]",
    "",
    "✅ **Correct Answer: [Letter]) [Answer text]**",
    "💡 **Explanation:** [One sentence referencing the document]",
    "",
    "---",
  ].join("\n");

  return `You are an experienced university professor creating an exam.
${langInstruction}
Generate exactly ${count} MCQs from "${filename}" using EXACTLY this format with no deviations:

${exampleFormat}

RULES:
- Copy the format above exactly — every blank line, every ---
- Each A) B) C) D) must be on its own separate line
- Wrong options must be plausible, not obvious
- Mix easy, medium, hard difficulty
- Cover different sections of the document
- End with: **📊 Difficulty Breakdown:** Easy: X | Medium: X | Hard: X
${SHARED_RULES}
Document: "${filename}"
---
${sliceContent(content, CONTENT_LIMITS.mcq)}
---
Student request: ${question}`;
};

const teacherQuestionsPrompt = (
  content: string,
  question: string,
  filename: string,
  lang: SupportedLanguage
): string => {
  const count = extractCount(question, MAX_QUESTIONS);
  const langInstruction = languageRule(lang);

  return `You are a university professor preparing exam questions.
${langInstruction}
Generate exactly ${count} exam-style questions from "${filename}":

**Q1. [Question]**

📝 **Model Answer:** [2-4 sentence answer a student should write]

🎯 **Marks:** [2, 5, or 10]

---

Rules:
- Mix: definition, explain, compare, analyze, apply
- Test real understanding, not just memory
- End with **📚 Study Focus:** top 3 topics to revise
${SHARED_RULES}
Document: "${filename}"
---
${sliceContent(content, CONTENT_LIMITS.questions)}
---
Student request: ${question}`;
};

const teacherExplainPrompt = (
  content: string,
  question: string,
  filename: string,
  lang: SupportedLanguage
): string => {
  const langInstruction = languageRule(lang);

  return `You are a university professor explaining a concept to a student.
${langInstruction}
**📖 Definition / Overview**
2-3 sentence plain-language explanation.

**🔍 In More Detail**
Deeper explanation with context from the document.

**💡 Real World Example**
A practical example to help the student understand.

**⚠️ Common Misconception**
One thing students often get wrong — only if relevant.

**🧠 Remember This**
One-line takeaway to memorize.

Rules:
- Use ONLY information from the document
- Be encouraging and clear
${SHARED_RULES}
Document: "${filename}"
---
${sliceContent(content, CONTENT_LIMITS.explain)}
---
Student question: ${question}`;
};

const teacherGeneralPrompt = (
  content: string,
  question: string,
  filename: string,
  lang: SupportedLanguage
): string => {
  const langInstruction = languageRule(lang);

  return `You are an experienced university professor and academic mentor.
${langInstruction}
A student has asked you a question about "${filename}". Answer it helpfully using the document.

Format your response clearly using Markdown:
- Use **bold headings** to organize sections
- Use bullet points for lists or multiple items
- Use numbered lists for steps or ranked items
- Keep the response focused and educational

If the student asks for key points, important topics, highlights, takeaways, or anything similar —
extract and present them clearly from the document in a well-structured format.

${SHARED_RULES}
Document: "${filename}"
---
${sliceContent(content, CONTENT_LIMITS.general_teacher)}
---
Student question: ${question}`;
};

// ─────────────────────────────────────────────────────────────
//  ANALYST PROMPTS
// ─────────────────────────────────────────────────────────────

const analystSummarizePrompt = (
  content: string,
  question: string,
  filename: string,
  lang: SupportedLanguage
): string => {
  const langInstruction = languageRule(lang);

  return `You are a professional document analyst.
${langInstruction}
Analyze "${filename}" and provide a structured analytical summary:

**📋 Executive Summary**
3-4 sentences capturing the core purpose and conclusions of the document.

**🔑 Key Findings**
Bullet points of the most critical data points, facts, or conclusions.

**📊 Data & Evidence**
Any numbers, statistics, or specific evidence mentioned in the document.

**⚡ Critical Insights**
What stands out — patterns, anomalies, or important implications.

**✅ Conclusion**
What this document ultimately communicates in 1-2 sentences.

Rules:
- Be precise and objective
- Use professional analytical language
- Always use Markdown formatting
${SHARED_RULES}
Document: "${filename}"
---
${sliceContent(content, CONTENT_LIMITS.summarize)}
---
Request: ${question}`;
};

const analystComparePrompt = (
  content: string,
  question: string,
  filename: string,
  lang: SupportedLanguage
): string => {
  const langInstruction = languageRule(lang);

  return `You are a professional document analyst performing a comparative analysis.
${langInstruction}
**📊 Comparison Overview**
What is being compared and why it matters.

**⚖️ Side-by-Side Analysis**
| Aspect | Option A | Option B |
|--------|----------|----------|
| [aspect] | [detail] | [detail] |

**✅ Similarities**
What both sides share in common.

**❌ Key Differences**
The most important distinctions.

**🎯 Analytical Verdict**
Based strictly on the document — which option is stronger and why.

Rules:
- Base ALL comparisons strictly on document content
- If only one subject is mentioned, analyze its internal contrasts
- Be objective, not opinionated
${SHARED_RULES}
Document: "${filename}"
---
${sliceContent(content, CONTENT_LIMITS.compare)}
---
Request: ${question}`;
};

const analystExtractPrompt = (
  content: string,
  question: string,
  filename: string,
  lang: SupportedLanguage
): string => {
  const langInstruction = languageRule(lang);

  return `You are a professional document analyst extracting specific information.
${langInstruction}
**🔍 Extracted Information**
Present the requested data in the clearest format possible:
- If it's a list → use bullet points
- If it's data → use a table
- If it's text → quote directly with page context

**📍 Source Location**
Where in the document this information appears.

**⚠️ Completeness Note**
Flag if the extraction may be incomplete due to document length.

Rules:
- Extract ONLY what is explicitly in the document
- Do not infer or add information
${SHARED_RULES}
Document: "${filename}"
---
${sliceContent(content, CONTENT_LIMITS.extract)}
---
Request: ${question}`;
};

const analystGeneralPrompt = (
  content: string,
  question: string,
  filename: string,
  lang: SupportedLanguage
): string => {
  const langInstruction = languageRule(lang);

  return `You are a professional document analyst.
${langInstruction}
A user has asked you a question about "${filename}". Answer it using the document content.

Format your response clearly using Markdown:
- Use **bold headings** to organize sections
- Use bullet points for lists or multiple items  
- Use tables if comparing or organizing data
- Use numbered lists for ranked or sequential items
- Keep the response precise and professional

If the user asks for key points, important topics, main ideas, highlights, takeaways, 
top items, or anything similar — extract and present them clearly and completely.

${SHARED_RULES}
Document: "${filename}"
---
${sliceContent(content, CONTENT_LIMITS.general_analyst)}
---
Question: ${question}`;
};

// ─────────────────────────────────────────────────────────────
//  SUMMARY PROMPT — on upload
// ─────────────────────────────────────────────────────────────

export const buildSummaryPrompt = (content: string, filename: string): string =>
  `You are an experienced professor and document analyst.

A document called "${filename}" has been uploaded. Provide a structured overview:

**1. What This Document Is About**
2-3 sentence plain-language summary.

**2. Core Topics Covered**
Main topics as bullet points — short and clear.

**3. Key Concepts & Data**
Important terms, ideas, theories, or data points.

**4. Document Type**
What kind of document this is (academic paper, report, textbook chapter, contract, etc.)

**5. How to Use This Document**
One practical tip — whether studying it or analyzing it.

Document content:
---
${sliceContent(content, CONTENT_LIMITS.summary)}
---

Be clear, structured, and professional.`;

// ─────────────────────────────────────────────────────────────
//  MAIN ROUTER
// ─────────────────────────────────────────────────────────────

// Updated signature: all prompt functions now accept a SupportedLanguage arg
type PromptFn = (content: string, question: string, filename: string, lang: SupportedLanguage) => string;

const TEACHER_PROMPTS: Record<TeacherIntent, PromptFn> = {
  mcq:             teacherMCQPrompt,
  questions:       teacherQuestionsPrompt,
  explain:         teacherExplainPrompt,
  general_teacher: teacherGeneralPrompt,
};

const ANALYST_PROMPTS: Record<AnalystIntent, PromptFn> = {
  summarize:       analystSummarizePrompt,
  compare:         analystComparePrompt,
  extract:         analystExtractPrompt,
  general_analyst: analystGeneralPrompt,
};

export const buildPrompt = (
  intent: Intent,
  content: string,
  question: string,
  filename: string
): string => {
  // Detect language once, pass to every prompt builder
  const lang = detectLanguage(question);

  const teacherFn = TEACHER_PROMPTS[intent as TeacherIntent];
  if (teacherFn) return teacherFn(content, question, filename, lang);

  const analystFn = ANALYST_PROMPTS[intent as AnalystIntent];
  if (analystFn) return analystFn(content, question, filename, lang);

  // ultimate fallback — never fails
  return analystGeneralPrompt(content, question, filename, lang);
};