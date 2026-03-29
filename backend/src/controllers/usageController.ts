import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { getUserUsage } from "../services/usageservice";

// ─────────────────────────────────────────────────────────────
//  GET USAGE
// ─────────────────────────────────────────────────────────────
export const getUsage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) { res.status(401).json({ success: false, message: "Unauthorized" }); return; }

    const usage = await getUserUsage(userId);
    res.status(200).json({ success: true, data: usage });
  } catch (error) {
    next(error);
  }
};