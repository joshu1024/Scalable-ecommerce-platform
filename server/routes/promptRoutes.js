import express from "express";
import {
  promptMessage,
  streamChat,
  generateProductDescription,
  chatWithTools,
} from "../controllers/promptController.js";
import {
  aiRateLimiter,
  checkTokenQuota,
  validateAiInput,
} from "../middleware/aiMiddleware.js";

const router = express.Router();

router.post("/prompt", promptMessage);
router.post(
  "/stream",
  aiRateLimiter,
  checkTokenQuota,
  validateAiInput,
  streamChat,
);
router.post("/generate-description", aiRateLimiter, generateProductDescription);
router.post(
  "/tools",
  aiRateLimiter,
  checkTokenQuota,
  validateAiInput,
  chatWithTools,
);

export default router;
