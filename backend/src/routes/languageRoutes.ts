import express from "express";
import {
  getAllLanguages,
  addLanguage,
} from "../controllers/languageController.js";

const router = express.Router();

// เมื่อมีคนเรียก GET http://localhost:5000/api/languages
router.get("/", getAllLanguages);

router.post("/", addLanguage);

export default router;
