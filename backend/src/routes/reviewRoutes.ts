import express from 'express';
import {
  getAllReviews,
  createReview,
  updateReviewStatus,
  deleteReview,
} from '../controllers/reviewController.js'; // อย่าลืม .js

const router = express.Router();

// GET    /api/reviews                   -> ดึง review ทั้งหมด (รองรับ filter ผ่าน query string)
// POST   /api/reviews                   -> user เพิ่ม review ใหม่ (จากหน้า movie detail)
// PATCH  /api/reviews/:reviewId/status  -> อัปเดต post_status
// DELETE /api/reviews/:reviewId         -> ลบ review

router.get('/', getAllReviews);
router.post('/', createReview);
router.patch('/:reviewId/status', updateReviewStatus);
router.delete('/:reviewId', deleteReview);

export default router;
