import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    sendVibe,
    getPendingVibes,
    removeVibe
} from "../controllers/vibeController.js";

const router = express.Router();

router.post("/send", authMiddleware, sendVibe);
router.get("/pending", authMiddleware, getPendingVibes);
router.delete("/:receiverId", authMiddleware, removeVibe);

export default router;