import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';

const router = express.Router();

// เรียกใช้ผ่าน GET /api/dashboard
router.get('/', getDashboardStats);

export default router;