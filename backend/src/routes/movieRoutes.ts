import express from 'express';
import { getAllMovies } from '../controllers/movieController.js'; // อย่าลืม .js

const router = express.Router();

// เมื่อมีคนเรียก GET http://localhost:5000/api/movies
router.get('/', getAllMovies);

export default router;