import express from "express";
import { getAllGenres } from "../controllers/genreController.js";

const router = express.Router();

// เมื่อมีคนเรียก GET http://localhost:5000/api/genres
router.get("/", getAllGenres);

export default router;
