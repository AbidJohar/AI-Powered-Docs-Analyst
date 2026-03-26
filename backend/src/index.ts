import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
import documentRoutes from './routes/documentRoutes';
import authRoutes from "./routes/authRoutes"
import { errorHandler } from './middleware/errorHandler';
import { prisma } from "./config/db"
import env from "./config/env";
import cookieParser from "cookie-parser";


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ 
    origin: env.frontendurl, // add your's website domain in .env
    credentials: true ,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// Routes start point
app.use('/api', documentRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const start = async () => {
  await prisma.$connect();
  // await initDB();
  app.listen(PORT as number,  () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

start();
