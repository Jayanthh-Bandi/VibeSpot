import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
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

// Get Logged-in User (clean profile data)
router.get(
    "/me",
    authMiddleware,
    getCurrentUser
);

// Deprecated: use /me instead
router.get("/profile", authMiddleware, getCurrentUser);

router.patch("/profile", authMiddleware, updateUserProfile);

// Logout
router.post("/logout", logoutUser);

export default router;