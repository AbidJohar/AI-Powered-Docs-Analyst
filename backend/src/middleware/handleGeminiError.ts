// helper to handle Gemini errors consistently
const handleGeminiError = (error: any): never => {
  const message = error?.message ?? "";

  if (
    error?.status === 429 ||
    message.includes("RESOURCE_EXHAUSTED") ||
    message.includes("rate_limit")
  ) {
    const retryMatch = message.match(/retry in (\d+)/i);
    const retryAfter = retryMatch ? parseInt(retryMatch[1]) : 36;

    const err: any = new Error("AI rate limit reached. Please try again shortly.");
    err.code = 429;
    err.retryAfter = retryAfter;
    throw err;
  }

  throw new Error("Failed to contact AI service.");
};

export default handleGeminiError;