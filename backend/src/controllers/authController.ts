import type { Request, Response } from "express";
import pool from "../config/db.js";

/**
 * Auth Controller (User-facing)
 * ห้ามแตะหรือซ้ำกับของ admin userController ที่มี getAllUsers, updateUserRole etc.
 *
 * ⚠️ ในโปรเจคจริงควรใช้ bcrypt + JWT — แต่ตามคำพูดในสเปก "ชั่งแม่งเรื่อง Security"
 *    ดังนั้นเก็บรหัสเป็น plaintext ตามที่ schema ออกแบบไว้ (user_password VARCHAR(255))
 */

/* =============================================================================
 * POST /api/auth/check-username
 * เช็คว่ามีผู้ใช้ชื่อ [...] ในฐานข้อมูลหรือไม่ (Login page step 1)
 * Body: { username }
 * Response: { exists: true|false }
 * ===========================================================================*/
export const checkUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.body as { username?: string };
    if (!username) {
      res.status(400).json({ message: "ต้องส่ง username" });
      return;
    }

    const result = await pool.query(
      "SELECT 1 FROM app_user WHERE username = $1 LIMIT 1",
      [username]
    );

    res.status(200).json({ exists: result.rowCount! > 0 });
  } catch (error) {
    console.error("Error in checkUsername:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
};

/* =============================================================================
 * POST /api/auth/login
 * Body: { username, password }
 * Response: { user: {...} }  (ไม่ส่ง password กลับ)
 *
 * รวม 2 query ใน spec — เช็ครหัส + ดึงข้อมูล user — เป็น endpoint เดียว
 * เพราะ frontend ต้องใช้ทั้งคู่หลัง login สำเร็จอยู่แล้ว
 * ===========================================================================*/
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body as {
      username?: string;
      password?: string;
    };
    if (!username || !password) {
      res.status(400).json({ message: "ต้องส่ง username และ password" });
      return;
    }

    const result = await pool.query(
      `SELECT user_id, username, email, img_path, user_password, register_date,
              user_status, user_role, country_code
       FROM app_user WHERE username = $1`,
      [username]
    );

    if (result.rowCount === 0) {
      res.status(401).json({ message: "ไม่พบผู้ใช้นี้" });
      return;
    }

    const user = result.rows[0];

    // เช็ครหัส (plaintext ตาม spec)
    if (user.user_password !== password) {
      res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });
      return;
    }

    if (user.user_status === "banned" || user.user_status === "suspended") {
      res.status(403).json({ message: `บัญชีของคุณถูก ${user.user_status}` });
      return;
    }

    // ไม่ส่ง password กลับ
    delete user.user_password;
    res.status(200).json({ message: "Login สำเร็จ", user });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
  }
};

/* =============================================================================
 * POST /api/auth/register
 * Body: { username, email, password, country_code? }
 * Response: { user }
 * ===========================================================================*/
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, country_code } = req.body as {
      username?: string;
      email?: string;
      password?: string;
      country_code?: string;
    };

    if (!username || !email || !password) {
      res.status(400).json({ message: "ต้องส่ง username, email, password" });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ message: "รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร" });
      return;
    }

    try {
      // user_id auto-generate จาก DEFAULT 'U' || nextval(...)
      // user_status default 'active', user_role default 'customer'
      const result = await pool.query(
        `INSERT INTO app_user (username, email, user_password, country_code, user_status)
         VALUES ($1, $2, $3, $4, 'active')
         RETURNING user_id, username, email, img_path, register_date,
                   user_status, user_role, country_code`,
        [username, email, password, country_code ?? null]
      );

      res.status(201).json({ message: "สมัครสมาชิกสำเร็จ", user: result.rows[0] });
    } catch (dbError) {
      const code = (dbError as { code?: string }).code;
      if (code === "23505") {
        res.status(409).json({ message: "username หรือ email นี้ถูกใช้แล้ว" });
        return;
      }
      if (code === "23503") {
        res.status(400).json({ message: "country_code ไม่ถูกต้อง" });
        return;
      }
      throw dbError;
    }
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการสมัครสมาชิก" });
  }
};

/* =============================================================================
 * PUT /api/auth/:userId/password
 * Body: { current_password, new_password }
 * ===========================================================================*/
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { current_password, new_password } = req.body as {
      current_password?: string;
      new_password?: string;
    };

    if (!current_password || !new_password) {
      res.status(400).json({ message: "ต้องส่ง current_password และ new_password" });
      return;
    }
    if (new_password.length < 6) {
      res.status(400).json({ message: "รหัสผ่านใหม่ต้องยาวอย่างน้อย 6 ตัวอักษร" });
      return;
    }

    // เช็ครหัสปัจจุบันก่อน
    const check = await pool.query(
      "SELECT user_password FROM app_user WHERE user_id = $1",
      [userId]
    );
    if (check.rowCount === 0) {
      res.status(404).json({ message: "ไม่พบ user" });
      return;
    }
    if (check.rows[0].user_password !== current_password) {
      res.status(401).json({ message: "รหัสผ่านปัจจุบันไม่ถูกต้อง" });
      return;
    }

    await pool.query(
      "UPDATE app_user SET user_password = $1 WHERE user_id = $2",
      [new_password, userId]
    );

    res.status(200).json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" });
  } catch (error) {
    console.error("Error in changePassword:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน" });
  }
};
