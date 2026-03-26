import { Router } from "express";
import { googleLogin, logout, refreshToken, getMe } from "../controllers/authController";
import authMiddleware from "../middleware/authMiddleware";


const router = Router();

// ─────────────────────────────────────────────────────────────
//  GOOGLE AUTH ROUTES
// ─────────────────────────────────────────────────────────────

router.post('/google-login', googleLogin);
router.post("/refresh",authMiddleware, refreshToken);
router.get("/logout",authMiddleware, logout);
router.get("/my-profile", authMiddleware, getMe);


export default router;

