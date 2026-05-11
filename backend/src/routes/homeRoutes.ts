import express from 'express';
import { getAllMovies } from '../controllers/homeController.js';

const router = express.Router();

// GET /api/movies
router.get('/', getAllMovies);

export default router;