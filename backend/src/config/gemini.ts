import { GoogleGenAI } from "@google/genai";
import env from "./env";

const MODEL = "gemini-2.5-flash-lite";

const API_KEYS = [
    env.geminikey1,
    env.geminikey2,
    env.geminikey3,
].filter(Boolean) as string[];

if (API_KEYS.length === 0) throw new Error("No Gemini API keys found in env");

const clients = API_KEYS.map((key) => new GoogleGenAI({ apiKey: key }));
let currentIndex = 0;

export const generateWithFallback = async (prompt: string): Promise<any> => {
    const totalKeys = clients.length;

    // ← snapshot starting index so we try each key exactly once
    const startIndex = currentIndex;

    for (let attempt = 0; attempt < totalKeys; attempt++) {
        // ← calculate which key to use directly, no separate getNextClient()
        const keyIndex = (startIndex + attempt) % totalKeys;
        const client = clients[keyIndex];

        try {
            console.log(`[Gemini] Using key ${keyIndex + 1}`);

            const response = await client.models.generateContent({
                model: MODEL,
                contents: prompt,
            });

            // ← advance currentIndex for next request's round robin
            currentIndex = (keyIndex + 1) % totalKeys;

            return response.text ?? "";

        } catch (err: any) {
            const isRateLimit =
                err?.status === 429 ||
                err?.message?.includes("429") ||
                err?.message?.includes("RESOURCE_EXHAUSTED");

            // ADD THIS 👇
            const isInvalidKey =
                err?.status === 404 ||
                err?.message?.includes("404") ||
                err?.message?.includes("API_KEY_INVALID");

            console.warn(`[Gemini] Key ${keyIndex + 1} failed: ${err?.message}`);

            // Skip bad keys just like rate-limited ones
            if ((isRateLimit || isInvalidKey) && attempt < totalKeys - 1) {
                console.warn(`[Gemini] Trying next key...`);
                continue;
            }

            throw err;
        }
    }
}


// import { GoogleGenAI } from "@google/genai";
// import env from "./env";


// // The client gets the API key from the environment variable `GEMINI_API_KEY`.
// export const geminiClient = new GoogleGenAI({ apiKey: env.geminikey3 });




