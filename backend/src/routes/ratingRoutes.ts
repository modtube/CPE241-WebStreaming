import express from "express";
import { getAllRatings, addRating } from "../controllers/ratingController.js";

const router = express.Router();

// เมื่อมีคนเรียก GET http://localhost:5000/api/ratings
router.get("/", getAllRatings);

router.post("/", addRating);

export default router;
