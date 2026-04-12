import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 200,               // max requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: (req: Request, res: Response) => {
    return {
      status: 429,
      error: "Too Many Requests",
      message: `Rate limit exceeded. Try again after 15 minutes.`,
    };
  },
  skip: (req: Request) => {
    // Optionally whitelist IPs
    const whitelist = ["127.0.0.1"];
    return whitelist.includes(req.ip ?? "");
  },
});

export default apiLimiter;