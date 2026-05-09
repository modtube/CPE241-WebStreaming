import express from "express";
import {
  getAllReviews,
  getTotalMovieReview,
} from "../controllers/reviewController.js";

const router = express.Router();

// เมื่อมีคนเรียก GET http://localhost:5000/api/reviews
// หรือ http://localhost:5000/api/reviews?movie=[...]&user=[...]
// (movie กับ user จะค้นเป็นเลข ID, ใส่แค่อย่างใดอย่างหนึ่งก็ได้)
router.get("/", getAllReviews);

// เมื่อมีคนเรียก GET http://localhost:5000/api/reviews/total?movie=[...]
// (movie เป็นเลข ID)
router.get("/total", getTotalMovieReview);

export default router;
