import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY is missing from .env');
}



// The client gets the API key from the environment variable `GEMINI_API_KEY`.
export const geminiClient = new GoogleGenAI({ apiKey : process.env.GEMINI_API_KEY});

 

 
