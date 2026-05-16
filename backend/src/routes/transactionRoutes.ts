import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  getAllTransactions,
  getTransactionById,
  refundTransaction,
  getTransactionByUserId,
  getTransactionDetail,
  createTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/", getAllTransactions);
router.get("/:id", getTransactionById);

router.get("/user/:user_id", authenticateToken, getTransactionByUserId);

router.get("/detail/:transaction_id", authenticateToken, getTransactionDetail);

router.put("/:id/refund", refundTransaction);

router.post("/", authenticateToken, createTransaction);

export default router;
