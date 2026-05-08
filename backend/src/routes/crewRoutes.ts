import express from 'express';
import { getAllCrew } from '../controllers/crewController.js';

const router = express.Router();

router.get('/', getAllCrew);

export default router;