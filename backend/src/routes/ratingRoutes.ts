import express from "express";
import { getAllRatings } from "../controllers/ratingController.js";

const router = express.Router();

// เมื่อมีคนเรียก GET http://localhost:5000/api/ratings
router.get("/", getAllRatings);

export default router;
