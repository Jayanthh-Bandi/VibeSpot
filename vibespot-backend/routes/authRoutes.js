import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
console.log("✅ Auth Routes Loaded");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

console.log("Profile route registered");

router.get("/profile", authMiddleware, (req, res) => {

    return res.json({
        success: true,
        user: req.user
    });

});

// Get Logged-in User
router.get(
    "/me",
    authMiddleware,
    getCurrentUser
);

// Logout
router.post("/logout", logoutUser);

export default router;