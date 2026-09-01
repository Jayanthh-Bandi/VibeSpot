// import dotenv from "dotenv";
// import { createClient } from "@supabase/supabase-js";

// // Load environment variables
// dotenv.config();

// console.log("SUPABASE_URL =", process.env.SUPABASE_URL);
// console.log(
//     "SUPABASE_ANON_KEY exists =",
//     !!process.env.SUPABASE_ANON_KEY
// );

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//     throw new Error("Supabase environment variables are missing.");
// }

// const supabase = createClient(
//     supabaseUrl,
//     supabaseAnonKey
// );

// export default supabase;

import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

export default supabase;