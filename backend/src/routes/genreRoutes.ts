import express from "express";
import { getAllGenres, addGenre } from "../controllers/genreController.js";

const router = express.Router();

// เมื่อมีคนเรียก GET http://localhost:5000/api/genres
router.get("/", getAllGenres);

router.post("/", addGenre);

export default router;
