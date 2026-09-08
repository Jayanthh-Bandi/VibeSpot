import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

console.log("Supabase URL loaded:", !!env.SUPABASE_URL);
console.log("Supabase anon key loaded:", !!env.SUPABASE_ANON_KEY);

const supabase = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY
);

export default supabase;