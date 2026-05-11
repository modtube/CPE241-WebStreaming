import express from "express";
import {
  getAllGenres,
  addGenre,
  updateGenre,
  deleteGenre,
} from "../controllers/genreController.js";

const router = express.Router();

// เมื่อมีคนเรียก GET http://localhost:5000/api/genres
router.get("/", getAllGenres);

router.post("/", addGenre);

router.put("/:genre_id", updateGenre);

router.delete("/:genre_id", deleteGenre);

export default router;
