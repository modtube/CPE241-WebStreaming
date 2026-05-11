import express from 'express';
import {
  getAllReviews,
  createReview,
  updateReviewStatus,
  deleteReview,
  getTotalMovieReview,
} from '../controllers/reviewController.js'; // อย่าลืม .js

const router = express.Router();

// GET    /api/reviews                   -> ดึง review ทั้งหมด (รองรับ filter, search, sort, pagination)
// GET    /api/reviews/total?movie=M0001 -> นับจำนวน review + เฉลี่ย rating ของหนังเรื่องนึง
// POST   /api/reviews                   -> user เพิ่ม review ใหม่ (จากหน้า movie detail)
// PATCH  /api/reviews/:reviewId/status  -> อัปเดต post_status
// DELETE /api/reviews/:reviewId         -> ลบ review

router.get('/', getAllReviews);
router.get('/total', getTotalMovieReview);
router.post('/', createReview);
router.patch('/:reviewId/status', updateReviewStatus);
router.delete('/:reviewId', deleteReview);

export default router;
