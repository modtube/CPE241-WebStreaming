import express from "express";
import {
  getReviewByMovieId,
  createReview,
} from "../controllers/reviewController.js"; // สมมติว่าเก็บไว้ใน reviewController

const router = express.Router();

/**
 * @route   GET /api/home/:id/reviews
 * @desc    ดึงข้อมูลรีวิวทั้งหมดของหนังตาม movie_id (รองรับ pagination)
 */
router.get("/:id/reviews", getReviewByMovieId);

router.post("/reviews", createReview);

export default router;
