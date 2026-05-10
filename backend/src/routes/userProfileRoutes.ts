import express from "express";
import {
  getMyProfile,
  updateMyProfile,
  getMyLibrary,
  getMyTransactions,
  getMyTransactionDetail,
} from "../controllers/userProfileController.js";

const router = express.Router();

// GET    /api/me/:userId                              -> profile ของ user ตัวเอง (Edit Profile)
// PUT    /api/me/:userId                              -> update profile
// GET    /api/me/:userId/library                      -> หนังที่ซื้อแล้ว
// GET    /api/me/:userId/transactions                 -> รายการ transaction
// GET    /api/me/:userId/transactions/:transactionId  -> รายละเอียด transaction + items

router.get("/:userId", getMyProfile);
router.put("/:userId", updateMyProfile);
router.get("/:userId/library", getMyLibrary);
router.get("/:userId/transactions", getMyTransactions);
router.get("/:userId/transactions/:transactionId", getMyTransactionDetail);

export default router;
