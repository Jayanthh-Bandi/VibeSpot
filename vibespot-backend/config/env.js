import dotenv from "dotenv";

dotenv.config();

if (!process.env.SUPABASE_URL) {
    throw new Error("SUPABASE_URL is missing from .env");
}

if (!process.env.SUPABASE_ANON_KEY) {
    throw new Error("SUPABASE_ANON_KEY is missing from .env");
}

export const env = {
    PORT: process.env.PORT || 5000,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
};