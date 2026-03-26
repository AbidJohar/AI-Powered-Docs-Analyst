import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import oauth2Client from "../config/googleClient";
import { google } from "googleapis";
import { prisma } from "../config/db";



// ─────────────────────────────────────────────────────────────
//  GOOGLE LOGIN
// ─────────────────────────────────────────────────────────────


export const googleLoginService = async ({ code }: { code: string }) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    if (!userInfo.email || !userInfo.name || !userInfo.id) {
      return {
        status: 400,
        body: { success: false, message: "Failed to get user info from Google" },
      };
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { googleId: userInfo.id },
    });

    if (!user) {
      // Brand new user — create one
      user = await prisma.user.create({
        data: {
          googleId: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          avatar: userInfo.picture ?? null,
          refreshToken: tokens.refresh_token ?? null,
        },
      });
    } else {
      // Existing user — update refresh token if Google returned a new one
      if (tokens.refresh_token) {
        user = await prisma.user.update({
          where: { googleId: userInfo.id },
          data: { refreshToken: tokens.refresh_token },
        });
      }
    }

    return {
      user,
      status: 200,
      body: {
        success: true,
        message: "Login successful.",
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      },
    };
  } catch (err) {
    console.error("Google login error:", err);
    return {
      status: 500,
      body: { success: false, message: "Internal server error" },
    };
  }
};

// ─────────────────────────────────────────────────────────────
//  REFRESH TOKEN
// ─────────────────────────────────────────────────────────────

export const refreshTokenService = async (token: string) => {
  if (!token) {
    return {
      status: 401,
      body: { success: false, message: "No refresh token." },
    };
  }

  let payload: { id: string };
  try {
    payload = jwt.verify(
      token,
      process.env.JWT_REFRESHTOKEN_SECRET!
    ) as { id: string };
  } catch {
    return {
      status: 401,
      body: { success: false, message: "Invalid or expired refresh token." },
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
  });

  if (!user || !user.refreshToken) {
    return {
      status: 401,
      body: { success: false, message: "Session not found. Please log in again." },
    };
  }

  const isValid = await bcrypt.compare(token, user.refreshToken);
  if (!isValid) {
    // Token reuse detected — clear refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: null },
    });
    return {
      status: 401,
      body: { success: false, message: "Token reuse detected. Please log in again." },
    };
  }

  return {
    status: 200,
    user,
    body: {
      success: true,
      message: "Tokens refreshed.",
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    },
  };
};

// ─────────────────────────────────────────────────────────────
//  LOGOUT
// ─────────────────────────────────────────────────────────────

export const logoutService = async (token: string) => {
  if (!token) return;

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_REFRESHTOKEN_SECRET!
    ) as { id: string };

    await prisma.user.update({
      where: { id: payload.id },
      data: { refreshToken: null },
    });
  } catch {
    // Token already expired — nothing to clean up
  }
};
