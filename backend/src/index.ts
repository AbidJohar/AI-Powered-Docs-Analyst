import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import documentRoutes from './routes/documentRoutes';
import { errorHandler } from './middleware/errorHandler';
import  {prisma} from "./config/db"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', documentRoutes);

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
  app.listen(PORT as number, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
};

start();
