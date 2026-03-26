import { Request, Response, NextFunction  } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";
import { AuthRequest } from "../types";
 
const authMiddleware = (req : Request, res : Response, next : NextFunction) => {


  const token = req.cookies?.accessToken;
    console.log("token:", token);
    

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized: no access token.",
    });
  }

  try {
    const decoded = jwt.verify(token, env.jwtAccessSecret) as jwt.JwtPayload;
    (req as AuthRequest).user = { id: decoded.id  };
    next();
  } catch (err : any) {
     console.log("Token Error:",err);
    // Distinguish between expired and outright invalid so logs are useful.
    // Both return 401 — the frontend interceptor will silently refresh on either.
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "Access token expired.",
      });
    }

    return res.status(401).json({
      status: "error",
      message: "Invalid access token.",
    });
  }
};

export default authMiddleware;