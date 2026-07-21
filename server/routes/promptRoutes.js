import express from "express";
import {
  promptMessage,
  streamChat,
  generateProductDescription,
} from "../controllers/promptController.js";

const router = express.Router();

router.post("/prompt", promptMessage);
router.post("/stream", streamChat);
router.post("/generate-description", generateProductDescription);

export default router;
