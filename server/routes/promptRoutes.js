import express from "express";
import {
  promptMessage,
  generateProductDescription,
} from "../controllers/promptController.js";

const router = express.Router();

router.post("/prompt", promptMessage);
router.post("//generate-description", generateProductDescription);

export default router;
