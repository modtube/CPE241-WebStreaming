import type { Request, Response } from "express";
import pool from "../config/db.js";

/**
 * User Profile Controller (User-facing)
 * จัดการข้อมูลของ user ตัวเอง: profile, personal library, transaction history
 * แยกจาก admin userController (ที่ใช้ดู/จัดการ user ทุกคน)
 */

/* =============================================================================
 * GET /api/me/:userId
 * Query ข้อมูลทุกอย่างของผู้ใช้คนนี้ (สำหรับหน้า Edit Profile)
 * ===========================================================================*/
export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const result = await pool.query(
      `SELECT user_id, username, email, img_path, register_date,
              user_status, user_role, country_code
       FROM app_user WHERE user_id = $1`,
      [userId]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: "ไม่พบ user" });
      return;
    }

    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    console.error("Error in getMyProfile:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
};

/* =============================================================================
 * PUT /api/me/:userId
 * Update attribute ของ user คนนี้ (สำหรับหน้า Edit Profile)
 * Body: { username?, email?, img_path?, country_code? }
 *
 * ⚠️ ไม่ให้แก้ user_role / user_status / user_password ตรงนี้
 *    role/status ต้องผ่าน admin endpoint (ห้ามแตะ)
 *    password ต้องใช้ /api/auth/:userId/password (มีการเช็ครหัสเดิม)
 * ===========================================================================*/
export const updateMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { username, email, img_path, country_code } = req.body as {
      username?: string;
      email?: string;
      img_path?: string | null;
      country_code?: string | null;
    };

    // สร้าง SET clause เฉพาะ field ที่ส่งมา (ไม่ทับ field ที่ไม่ได้ส่ง)
    const sets: string[] = [];
    const values: unknown[] = [];
    let i = 1;

    if (username !== undefined) {
      sets.push(`username = $${i++}`);
      values.push(username);
    }
    if (email !== undefined) {
      sets.push(`email = $${i++}`);
      values.push(email);
    }
    if (img_path !== undefined) {
      sets.push(`img_path = $${i++}`);
      values.push(img_path);
    }
    if (country_code !== undefined) {
      sets.push(`country_code = $${i++}`);
      values.push(country_code);
    }

    if (sets.length === 0) {
      res.status(400).json({ message: "ไม่มีข้อมูลให้อัปเดต" });
      return;
    }

    values.push(userId);
    const sql = `
      UPDATE app_user SET ${sets.join(", ")}
      WHERE user_id = $${i}
      RETURNING user_id, username, email, img_path, register_date,
                user_status, user_role, country_code;
    `;

    try {
      const result = await pool.query(sql, values);
      if (result.rowCount === 0) {
        res.status(404).json({ message: "ไม่พบ user" });
        return;
      }
      res.status(200).json({
        message: "อัปเดต profile สำเร็จ",
        user: result.rows[0],
      });
    } catch (dbError) {
      const code = (dbError as { code?: string }).code;
      if (code === "23505") {
        res.status(409).json({ message: "username หรือ email นี้ถูกใช้แล้ว" });
        return;
      }
      throw dbError;
    }
  } catch (error) {
    console.error("Error in updateMyProfile:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
};

/* =============================================================================
 * GET /api/me/:userId/library
 * หนังทุกเรื่องที่เป็นของผู้ใช้คนนี้ (purchased — อยู่ใน personal_library)
 * รวมข้อมูล movie แบบครบ + genre + rating สำหรับหน้า Personal Library
 * ===========================================================================*/
export const getMyLibrary = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const sql = `
      SELECT
        m.movie_id,
        m.title,
        m.img_path,
        m.movie_description,
        m.release_date,
        EXTRACT(YEAR FROM m.release_date)::int AS year,
        mr.rating_label AS rating,
        m.country_code,
        pl.purchase_date,
        (SELECT COALESCE(JSON_AGG(g.genre_name), '[]'::json)
           FROM movie_genre mg
           JOIN genre g ON mg.genre_id = g.genre_id
          WHERE mg.movie_id = m.movie_id) AS genres,
        (SELECT COALESCE(ROUND(AVG(rv.rating), 1), 0)::float
           FROM reviews rv
          WHERE rv.movie_id = m.movie_id) AS average_rating
      FROM personal_library pl
      JOIN movie m ON pl.movie_id = m.movie_id
      LEFT JOIN movie_rating mr ON m.rating_id = mr.rating_id
      WHERE pl.user_id = $1
      ORDER BY pl.purchase_date DESC;
    `;
    const result = await pool.query(sql, [userId]);
    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("Error in getMyLibrary:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึง library" });
  }
};

/* =============================================================================
 * GET /api/me/:userId/transactions
 * Transaction ทั้งหมดของ user คนนี้
 * ===========================================================================*/
export const getMyTransactions = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const sql = `
      SELECT
        transaction_id,
        user_id,
        transaction_date,
        total_amount,
        payment_method,
        payment_status
      FROM transaction_list
      WHERE user_id = $1
      ORDER BY transaction_date DESC;
    `;
    const result = await pool.query(sql, [userId]);
    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("Error in getMyTransactions:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึง transactions" });
  }
};

/* =============================================================================
 * GET /api/me/:userId/transactions/:transactionId
 * รายละเอียด transaction (รวม items) — สำหรับ receipt modal
 * (7*) Query transaction_detail ทั้งหมดของ transaction อันที่ [...]
 * ===========================================================================*/
export const getMyTransactionDetail = async (req: Request, res: Response) => {
  try {
    const { userId, transactionId } = req.params;

    // เช็คว่า transaction นี้เป็นของ user คนนี้จริง
    const checkSql = `
      SELECT transaction_id, user_id, transaction_date, total_amount,
             payment_method, payment_status
      FROM transaction_list
      WHERE transaction_id = $1 AND user_id = $2;
    `;
    const txnResult = await pool.query(checkSql, [transactionId, userId]);
    if (txnResult.rowCount === 0) {
      res.status(404).json({ message: "ไม่พบ transaction หรือไม่ใช่ของคุณ" });
      return;
    }

    // ดึง transaction_detail
    const detailSql = `
      SELECT detail_id, transaction_id, movie_id, movie_name,
             original_price, discount_applied, sold_price
      FROM transaction_detail
      WHERE transaction_id = $1
      ORDER BY detail_id ASC;
    `;
    const detailResult = await pool.query(detailSql, [transactionId]);

    res.status(200).json({
      transaction: txnResult.rows[0],
      details: detailResult.rows,
    });
  } catch (error) {
    console.error("Error in getMyTransactionDetail:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
};
