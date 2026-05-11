import express from "express";
import {
  getAllRatings,
  addRating,
  updateRating,
  deleteRating,
} from "../controllers/ratingController.js";

const router = express.Router();

// เมื่อมีคนเรียก GET http://localhost:5000/api/ratings
router.get("/", getAllRatings);

router.post("/", addRating);

router.put("/:rating_id", updateRating);

router.delete("/:rating_id", deleteRating);

export default router;
