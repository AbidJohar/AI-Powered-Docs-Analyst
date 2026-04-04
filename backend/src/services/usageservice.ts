import { prisma } from '../config/db';

const LIMITS = {
  uploadsPerDay: 3,
  questionsPerDay: 10,
};

const today = () => new Date().toISOString().split("T")[0];

// ─── get or create today's log ────────────────────────────────
const getOrCreateUsageLog = async (userId: string) => {
  return await prisma.usageLog.upsert({
    where: { userId_date: { userId, date: today() } },
    create: { userId, date: today(), uploadCount: 0, questionCount: 0 },
    update: {},
  });
};

// ─── uploads ──────────────────────────────────────────────────
export const checkAndIncrementUpload = async (userId: string) => {
  const log = await getOrCreateUsageLog(userId);

  if (log.uploadCount >= LIMITS.uploadsPerDay) {
    const err = new Error(`Daily upload limit reached. You can upload ${LIMITS.uploadsPerDay} documents per day.`);
    (err as any).code = 429;
    throw err;
  }

  await prisma.usageLog.update({
    where: { userId_date: { userId, date: today() } },
    data: { uploadCount: { increment: 1 } },
  });
};

// ─── questions ────────────────────────────────────────────────
export const checkAndIncrementQuestion = async (userId: string) => {
  const log = await getOrCreateUsageLog(userId);

  if (log.questionCount >= LIMITS.questionsPerDay) {
    const err = new Error(`Daily question limit reached. You can ask ${LIMITS.questionsPerDay} questions per day.`);
    (err as any).code = 429;
    throw err;
  }

  await prisma.usageLog.update({
    where: { userId_date: { userId, date: today() } },
    data: { questionCount: { increment: 1 } },
  });
};


// ─── CHECK ONLY — limit reach ─────────────────────────
export const checkQuestionLimit = async (userId: string) => {
  const log = await getOrCreateUsageLog(userId);

  if (log.questionCount >= LIMITS.questionsPerDay) {
    const err = new Error(`Daily question limit reached. You can ask ${LIMITS.questionsPerDay} questions per day.`);
    (err as any).code = 429;
    throw err;
  }
};

// ─── INCREMENT ONLY — call after success ─────────────────────
export const incrementQuestion = async (userId: string) => {
  await prisma.usageLog.update({
    where: { userId_date: { userId, date: today() } },
    data: { questionCount: { increment: 1 } },
  });
};

// ─── get usage for frontend ───────────────────────────────────
export const getUserUsage = async (userId: string) => {
  const log = await getOrCreateUsageLog(userId);

  return {
    uploads: {
      used: log.uploadCount,
      limit: LIMITS.uploadsPerDay,
      remaining: Math.max(0, LIMITS.uploadsPerDay - log.uploadCount),
    },
    questions: {
      used: log.questionCount,
      limit: LIMITS.questionsPerDay,
      remaining: Math.max(0, LIMITS.questionsPerDay - log.questionCount),
    },
    resetsAt: "midnight UTC",
  };
};