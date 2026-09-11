import { logger } from "./logger.js";
import { env } from "../config/env.js";

const requiredVariables = {
    PORT: env.PORT,
    SUPABASE_URL: env.SUPABASE_URL,
    SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY
};

const validateEnv = () => {

    const missing = Object.entries(requiredVariables)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

    if (missing.length) {
        logger.error(
            `Missing environment variables: ${missing.join(", ")}`
        );
        process.exit(1);
    }

    logger.info("Environment variables validated successfully.");
};

export default validateEnv;