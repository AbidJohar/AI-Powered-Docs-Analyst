import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from 'express';
import cors from 'cors';
import documentRoutes from './routes/documentRoutes';
import authRoutes from "./routes/authRoutes"
import { errorHandler } from './middleware/errorHandler';
import { prisma } from "./config/db"
import env from "./config/env";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import usageRoutes from "./routes/usageRoutes";
import helmet from "helmet";
import apiLimiter from "./middleware/rateLimit"



const app = express();
const PORT = process.env.PORT || 3000;


// ─────────────────────────────────────────────────────────────
//  MIDDLEWARE
// ─────────────────────────────────────────────────────────────

app.use(helmet());
app.use(cors({
  origin: env.frontendurl, // add your's website domain in .env
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", apiLimiter)


// ─────────────────────────────────────────────────────────────
//  ROUTES STARTING POINT
// ─────────────────────────────────────────────────────────────
app.use(`/api/${env.version}`, documentRoutes);
app.use(`/api/${env.version}`, usageRoutes);
app.use(`/api/${env.version}/auth`, authRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const start = async () => {
  await prisma.$connect();
  app.listen(PORT as number, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

start();
