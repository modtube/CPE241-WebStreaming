import type { Request, Response } from "express";
import pool from "../config/db.js";

/**
 * Cart Controller (User-facing) — Checkout
 * Spec User-INSERT (2. Cart):
 *   • Insert transaction_list ใหม่ ที่มีรายละเอียดคือ [...]
 *   • Insert transaction_detail ใหม่ที่มีรายละเอียดคือ [...] และเป็นของ transaction_list [...]
 *
 * รวมเป็น 1 endpoint POST /api/cart/checkout เพราะต้องทำ atomically
 * (ถ้าใส่ transaction_list สำเร็จแต่ transaction_detail fail = ข้อมูลครึ่งๆ กลางๆ)
 *
 * เพิ่ม: ถ้า payment_status = 'Completed' ให้เพิ่มหนังเข้า personal_library ด้วย
 * (ตาม flow: ซื้อหนัง = หนังเข้า library ทันที)
 */

const VALID_PAYMENT_METHODS = [
  "credit_card",
  "debit_card",
  "paypal",
  "bank_transfer",
] as const;
type PaymentMethod = (typeof VALID_PAYMENT_METHODS)[number];

interface CartItem {
  movie_id: string;
  original_price: number;
  discount_applied?: number; // optional
  sold_price?: number; // ถ้าไม่ส่งจะใช้ original - discount
}

/* =============================================================================
 * POST /api/cart/checkout
 * Body: {
 *   user_id: "U00001",
 *   payment_method: "credit_card" | "debit_card" | "paypal" | "bank_transfer",
 *   items: [
 *     { movie_id: "M00001", original_price: 4.99, discount_applied: 0, sold_price: 4.99 }
 *   ]
 * }
 *
 * Transaction:
 *   1. BEGIN
 *   2. INSERT transaction_list (auto-generate transaction_id)
 *   3. INSERT transaction_detail (1 row per item)
 *   4. INSERT personal_library (1 row per item) — ถ้า Completed
 *   5. COMMIT
 * ===========================================================================*/
export const checkout = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { user_id, payment_method, items } = req.body as {
      user_id?: string;
      payment_method?: string;
      items?: CartItem[];
    };

    // ----- Validate -----
    if (!user_id) {
      res.status(400).json({ message: "ต้องส่ง user_id" });
      return;
    }
    if (!payment_method || !(VALID_PAYMENT_METHODS as readonly string[]).includes(payment_method)) {
      res.status(400).json({
        message: `payment_method ต้องเป็น 1 ใน: ${VALID_PAYMENT_METHODS.join(", ")}`,
      });
      return;
    }
    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: "ตะกร้าว่างเปล่า" });
      return;
    }

    // คำนวณ total และ validate items
    let total = 0;
    const normalized = items.map((it) => {
      const orig = Number(it.original_price);
      const disc = Number(it.discount_applied ?? 0);
      const sold = it.sold_price !== undefined ? Number(it.sold_price) : orig - disc;

      if (!it.movie_id || !Number.isFinite(orig) || orig < 0) {
        throw new Error("รายการในตะกร้าไม่ถูกต้อง");
      }
      total += sold;
      return { movie_id: it.movie_id, original_price: orig, discount_applied: disc, sold_price: sold };
    });

    // ----- BEGIN transaction -----
    await client.query("BEGIN");

    // 1. INSERT transaction_list
    // payment_status default 'Completed' (สำหรับ flow ปกติ ซื้อสำเร็จเลย)
    const txnResult = await client.query(
      `INSERT INTO transaction_list (user_id, total_amount, payment_method, payment_status)
       VALUES ($1, $2, $3, 'Completed')
       RETURNING *;`,
      [user_id, total, payment_method as PaymentMethod]
    );
    const transaction = txnResult.rows[0];

    // 2. INSERT transaction_detail แต่ละ item + ดึง movie_name จาก movie table
    const detailsCreated = [];
    for (const it of normalized) {
      // ดึง movie_name มาเก็บไว้ (Retained even if content is deleted ตาม comment ใน schema)
      const movieResult = await client.query(
        `SELECT title FROM movie WHERE movie_id = $1`,
        [it.movie_id]
      );
      if (movieResult.rowCount === 0) {
        throw new Error(`ไม่พบหนัง ${it.movie_id}`);
      }
      const movieName = movieResult.rows[0].title;

      const detailResult = await client.query(
        `INSERT INTO transaction_detail
            (transaction_id, movie_id, movie_name, original_price, discount_applied, sold_price)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *;`,
        [
          transaction.transaction_id,
          it.movie_id,
          movieName,
          it.original_price,
          it.discount_applied,
          it.sold_price,
        ]
      );
      detailsCreated.push(detailResult.rows[0]);

      // 3. INSERT personal_library — ถ้า user ยังไม่มีหนังนี้
      // ใช้ DO NOTHING (เพราะ schema นี้ไม่ได้บังคับ UNIQUE — ใช้ NOT EXISTS check)
      await client.query(
        `INSERT INTO personal_library (user_id, movie_id)
         SELECT $1::varchar, $2::varchar
         WHERE NOT EXISTS (
           SELECT 1 FROM personal_library
           WHERE user_id = $1::varchar AND movie_id = $2::varchar
         );`,
        [user_id, it.movie_id]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "ชำระเงินสำเร็จ",
      transaction,
      details: detailsCreated,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    const code = (error as { code?: string }).code;
    if (code === "23503") {
      res.status(404).json({ message: "ไม่พบ user หรือ movie" });
      return;
    }
    const msg = (error as Error).message;
    console.error("Error in checkout:", error);
    res.status(500).json({ message: msg || "เกิดข้อผิดพลาดในการชำระเงิน" });
  } finally {
    client.release();
  }
};
