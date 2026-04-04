const requiredEnvVars = [
    "DATABASE_URL",
    "JWT_ACESSTOKEN_SECRET",
    "JWT_REFRESHTOKEN_SECRET",
    "JWT_ACCESSTOKEN_EXPIRES_IN",
    "JWT_REFRESHTOKEN_EXPIRES_IN",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GEMINI_API_KEY_1",
    "GEMINI_API_KEY_2",
    "GEMINI_API_KEY_3",
    "FRONTEND_URL",
    "NODE_ENV",
    "VERSION"
] as const;

for (const key of requiredEnvVars) {
    if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
    }
}

const env = {
    databaseUrl: process.env.DATABASE_URL,
    jwtAccessSecret: process.env.JWT_ACESSTOKEN_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESHTOKEN_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    geminikey1: process.env.GEMINI_API_KEY_1,
    geminikey2: process.env.GEMINI_API_KEY_2,
    geminikey3: process.env.GEMINI_API_KEY_3,
    jwtAccessExpireIn: process.env.JWT_ACCESSTOKEN_EXPIRES_IN,
    jwtRefresExpireIn: process.env.JWT_REFRESHTOKEN_EXPIRES_IN,
    frontendurl: process.env.FRONTEND_URL || 'http://localhost:5173',
    nodeEnv: process.env.NODE_ENV,
    version: process.env.VERSION
};

export default env;