import express from "express";
import { getAllLanguages } from "../controllers/languageController.js";

const router = express.Router();

// เมื่อมีคนเรียก GET http://localhost:5000/api/languages
router.get("/", getAllLanguages);

export default router;
