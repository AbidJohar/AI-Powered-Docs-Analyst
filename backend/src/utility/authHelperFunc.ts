import env from "../config/env";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Response } from "express";
import { prisma } from "../config/db";


// ─────────────────────────────────────────────────────────────
//  Pure Helper functions
// ─────────────────────────────────────────────────────────────
const SALT_ROUNDS = 8;

const generateAccessToken = (id: string) =>
    jwt.sign({ id }, env.jwtAccessSecret, {
        expiresIn: env.jwtAccessExpireIn as jwt.SignOptions["expiresIn"],
    });

const generateRefreshToken = (id: string) =>
    jwt.sign({ id }, env.jwtRefreshSecret, {
        expiresIn: env.jwtRefresExpireIn as jwt.SignOptions["expiresIn"],
    });


export const createTokenPair = async (user: any) => {

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);


    const hashedRefresh = await bcrypt.hash(refreshToken, SALT_ROUNDS);
    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: hashedRefresh },
    });

    return { accessToken, refreshToken };
};


// ─────────────────────────────────────────────────────────────
//  Cookie Helpers  (pure HTTP concern — belongs in controller)
// ─────────────────────────────────────────────────────────────

const attachAccessCookie = (res: Response, token: string) => {


    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: env.nodeEnv === "production",
        sameSite: env.nodeEnv === "production" ? "none" : "lax",
        maxAge: 15 * 60 * 1000, // 15 minutes
        // maxAge: 2 * 60 * 1000, // 2 minutes (for testing )
        path: "/",
    });
}

const attachRefreshCookie = (res: Response, token: string) => {

    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: env.nodeEnv === "production",
        sameSite: env.nodeEnv === "production" ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 5, // 5 days
        // maxAge: 1000 * 60 * 5, // 5 mins ( for testing )
        path: "/api/auth/refresh",
    });
}


export const issueTokenCookies = async (res: Response, user: any) => {

    const { accessToken, refreshToken } = await createTokenPair(user);
    attachAccessCookie(res, accessToken);
    attachRefreshCookie(res, refreshToken);
};