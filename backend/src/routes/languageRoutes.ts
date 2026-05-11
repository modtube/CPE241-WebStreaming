import express from "express";
import {
  getAllLanguages,
  addLanguage,
  updateLanguage,
  deleteLanguage,
} from "../controllers/languageController.js";

const router = express.Router();

// เมื่อมีคนเรียก GET http://localhost:5000/api/languages
router.get("/", getAllLanguages);

router.post("/", addLanguage);

router.put("/:language_id", updateLanguage);

router.delete("/:language_id", deleteLanguage);

export default router;
