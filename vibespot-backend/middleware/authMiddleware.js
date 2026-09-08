import supabase from "../config/supabase.js";

const authMiddleware = async (req, res, next) => {
    console.log("Auth middleware executed");
    try {

        // Read Authorization header
        const authHeader = req.headers.authorization;

        // Check if header exists
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing."
            });
        }

        // Check Bearer format
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format."
            });
        }

        // Extract JWT
        const token = authHeader.split(" ")[1];

        // Verify token with Supabase
        const {
            data,
            error
        } = await supabase.auth.getUser(token);

        if (error || !data?.user) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token."
            });
        }

        // Store logged-in user
        req.user = data.user;
        req.user.accessToken = token;

        // Continue
        next();

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Authentication failed."
        });

    }
};

export default authMiddleware;