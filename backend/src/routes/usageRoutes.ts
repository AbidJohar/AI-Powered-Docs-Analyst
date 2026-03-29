import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { getUsage } from "../controllers/usageController";


const router = Router();


router.get("/get-states", authMiddleware, getUsage);


export default router;

