import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" });
  }

  try {
    const userResult = await pool.query(
      "SELECT user_id, username, user_password, user_role FROM app_user WHERE username = $1",
      [username],
    );

    if (userResult.rowCount === 0) {
      return res
        .status(401)
        .json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }

    const user = userResult.rows[0];

    // ✅ ตรวจสอบรหัสผ่านแบบข้อความดิบ (Plaintext) ตรงๆ
    if (password !== user.user_password) {
      return res
        .status(401)
        .json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }

    // สร้าง Token เพื่อให้ระบบส่วนอื่น (เช่น หน้าบ้าน) ยังทำงานตามโครงสร้างเดิมได้
    const token = jwt.sign(
      { userId: user.user_id, role: user.user_role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      user: {
        id: user.user_id,
        username: user.username,
        role: user.user_role,
      },
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const register = async (req: Request, res: Response) => {
  const { username, email, password, img_path, country_code } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  try {
    // บันทึก password ลงไปตรงๆ ไม่ต้องทำการ Hash
    const newUser = await pool.query(
      `INSERT INTO app_user (username, email, img_path, user_password, user_status, country_code, user_role) 
       VALUES ($1, $2, $3, $4, 'active', $5, 'customer') 
       RETURNING user_id, username, email`,
      [username, email, img_path || null, password, country_code || null],
    );

    res.status(201).json({ message: "ลงทะเบียนสำเร็จ", user: newUser.rows[0] });
  } catch (error: any) {
    console.error("Register Error:", error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  }
};
