import express from 'express';
import { getAllTransactions, getTransactionById, refundTransaction } from '../controllers/transactionController.js';

const router = express.Router();

router.get('/', getAllTransactions);
router.get('/:id', getTransactionById);
router.put('/:id/refund', refundTransaction);

export default router;