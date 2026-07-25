import express from "express";
import {
  promptMessage,
  streamChat,
  generateProductDescription,
  chatWithTools,
} from "../controllers/promptController.js";

const router = express.Router();

router.post("/prompt", promptMessage);
router.post("/stream", streamChat);
router.post("/generate-description", generateProductDescription);
router.post("/tools", chatWithTools);

export default router;
