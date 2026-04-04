// ─────────────────────────────────────────────────────────────
//  INTENT ROUTER
//  decides whether to respond like a teacher or an analyst
// ─────────────────────────────────────────────────────────────

export type AnswerMode = "teacher" | "analyst";
export type TeacherIntent = "mcq" | "questions" | "explain" | "general_teacher";
export type AnalystIntent = "summarize" | "compare" | "extract" | "general_analyst";
export type Intent = TeacherIntent | AnalystIntent;

// ─────────────────────────────────────────────────────────────
//  STEP 1 — detect mode (teacher vs analyst)
// ─────────────────────────────────────────────────────────────

const TEACHER_SIGNALS = [
  "mcq", "multiple choice", "quiz", "question", "exam", "test",
  "explain", "what is", "what are", "how does", "describe", "define",
  "study", "learn", "understand", "teach me", "tell me about",
  "practice", "flashcard", "notes", "summary for study",
  "i don't understand", "can you explain", "help me understand",
];

const ANALYST_SIGNALS = [
  "analyze", "analyse", "extract", "find all", "list all",
  "compare", "difference between", "contrast", "summarize",
  "key points", "main points", "overview", "insights",
  "data", "statistics", "numbers", "figures", "table",
  "conclusion", "recommendation", "findings", "report",
  "what does the document say", "according to the document",
];

export const detectMode = (question: string): AnswerMode => {
  const q = question.toLowerCase();

  let teacherScore = 0;
  let analystScore = 0;

  TEACHER_SIGNALS.forEach((signal) => {
    if (q.includes(signal)) teacherScore++;
  });

  ANALYST_SIGNALS.forEach((signal) => {
    if (q.includes(signal)) analystScore++;
  });

  // if tied or no signals — default to analyst
  // (doc analyzer is the core product, teacher is the bonus mode)
  return teacherScore > analystScore ? "teacher" : "analyst";
};

// ─────────────────────────────────────────────────────────────
//  STEP 2 — detect specific intent within each mode
// ─────────────────────────────────────────────────────────────

export const detectTeacherIntent = (question: string): TeacherIntent => {
  const q = question.toLowerCase();

  if (
    q.includes("mcq") ||
    q.includes("multiple choice") ||
    q.includes("quiz") ||
    q.includes("options")
  ) return "mcq";

  if (
    q.includes("question") ||
    q.includes("exam question") ||
    q.includes("test question") ||
    q.includes("practice question") ||
    q.includes("generate question")
  ) return "questions";

  if (
    q.includes("explain") ||
    q.includes("what is") ||
    q.includes("what are") ||
    q.includes("how does") ||
    q.includes("describe") ||
    q.includes("define") ||
    q.includes("teach me") ||
    q.includes("help me understand")
  ) return "explain";

  return "general_teacher";
};

export const detectAnalystIntent = (question: string): AnalystIntent => {
  const q = question.toLowerCase();

  if (
    q.includes("summarize") ||
    q.includes("summary") ||
    q.includes("overview") ||
    q.includes("key points") ||
    q.includes("main points")
  ) return "summarize";

  if (
    q.includes("compare") ||
    q.includes("difference between") ||
    q.includes("contrast") ||
    q.includes("versus") ||
    q.includes("vs")
  ) return "compare";

  if (
    q.includes("extract") ||
    q.includes("find all") ||
    q.includes("list all") ||
    q.includes("pull out") ||
    q.includes("get all")
  ) return "extract";

  return "general_analyst";
};

// ─────────────────────────────────────────────────────────────
//  STEP 3 — single entry point — returns mode + intent
// ─────────────────────────────────────────────────────────────

export const routeIntent = (question: string): { mode: AnswerMode; intent: Intent } => {
  const mode = detectMode(question);

  const intent =
    mode === "teacher"
      ? detectTeacherIntent(question)
      : detectAnalystIntent(question);

  return { mode, intent };
};