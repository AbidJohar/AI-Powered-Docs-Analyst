import { googleLoginService, refreshTokenService, logoutService } from "../services/authService";
import { Request, Response } from "express";
import { issueTokenCookies } from "../utility/authHelperFunc";
import { AuthRequest } from "../types";
import { prisma } from "../config/db";
import env from "../config/env";

// ─────────────────────────────────────────────────────────────
//  GOOGLE LOGIN
// ─────────────────────────────────────────────────────────────

export const googleLogin = async (req: Request, res: Response) => {

    try {
        const result = await googleLoginService(req.body);
        if (result.user) await issueTokenCookies(res, result.user);

        return res.status(200).json({
            success: true,
            message: "user login successfully",
            user: {
                name: result.user?.name,
                email: result.user?.email,
                avatar: result.user?.avatar
            }
        });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message || "Failed to login." });
    }
};

// ─────────────────────────────────────────────────────────────
//  REFRESH TOKEN
// ─────────────────────────────────────────────────────────────

export const refreshToken = async (req: Request, res: Response) => {
    console.log(" refreshToken in cookie:", req.cookies.refreshToken); // ← add this
    try {
        const token = req.cookies?.refreshToken;
         if (!token) {
            return {
              status: 401,
              body: { success: false, message: "No refresh token." },
            };
          }

        const result = await refreshTokenService(token);

        if (result.user) await issueTokenCookies(res, result.user);

        return res.status(200).json({
            success: true,
            message: "Token refresehed",
            user: {
                name: result.user?.name,
                email: result.user?.email,
                avatar: result.user?.avatar
            }
        });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message || "Failed to refresh token." });
    }
};

// ─────────────────────────────────────────────────────────────
//  LOGOUT
// ─────────────────────────────────────────────────────────────

export const logout = async (req: Request, res: Response) => {
    try {
        const token = req.cookies?.refreshToken;
        await logoutService(token);

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: env.nodeEnv === "production",
            sameSite: env.nodeEnv === "production" ? "none" : "lax",
            path: "/",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: env.nodeEnv === "production",
            sameSite: env.nodeEnv === "production" ? "none" : "lax",
            path: "/api/auth/refresh",
        });

        return res.status(200).json({ success: true, message: "Logged out successfully." });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message || "Failed to logout." });
    }
};

// ─────────────────────────────────────────────────────────────
//  GET ME (verify session)
// ─────────────────────────────────────────────────────────────

export const getMe = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthRequest).user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Not authenticated." });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
            },
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message || "Failed to get user." });
    }
};