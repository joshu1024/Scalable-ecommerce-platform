import express from "express";
import { promptMessage } from "../controllers/promptController.js";

const router = express.Router();

router.post("/prompt", promptMessage);

export default router;
