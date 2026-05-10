import express from "express";
import { checkout } from "../controllers/cartController.js";

const router = express.Router();

// POST /api/cart/checkout — สั่งซื้อหนังจากตะกร้า (transaction + library entry)
router.post("/checkout", checkout);

export default router;
