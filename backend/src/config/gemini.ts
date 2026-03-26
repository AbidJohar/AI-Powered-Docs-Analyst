import { GoogleGenAI } from "@google/genai";
import env from "./env";

 
// The client gets the API key from the environment variable `GEMINI_API_KEY`.
export const geminiClient = new GoogleGenAI({ apiKey : env.geminikey});

 

 
