import express from 'express';
import { getMovieReviews, upsertReview } from '../controllers/customerReviewController.js';

const router = express.Router();

router.get('/:movieId', getMovieReviews); 
router.post('/', upsertReview);           

export default router;