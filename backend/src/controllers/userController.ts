import type { Request, Response } from "express";
import pool from "../config/db.js";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      country_code,
      user_status,
      user_role,
      sort_by = "user_id", // ค่าเริ่มต้น
      order = "ASC", // ลำดับเริ่มต้น
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const queryParams: any[] = [];
    let whereConditions: string[] = [];

    // --- 1. ตรวจสอบความปลอดภัย (Whitelist Validation) ---
    const allowedColumns = ["user_id", "username", "email", "register_date"];
    const allowedOrder = ["ASC", "DESC"];

    // ถ้าค่าที่ส่งมาไม่อยู่ใน whitelist ให้กลับไปใช้ค่า default
    const actualSortBy = allowedColumns.includes(sort_by as string)
      ? sort_by
      : "user_id";
    const actualOrder = allowedOrder.includes((order as string).toUpperCase())
      ? (order as string).toUpperCase()
      : "ASC";

    // --- 2. จัดการ Search และ Filter (เหมือนเดิม) ---
    if (search) {
      queryParams.push(`%${search}%`);
      whereConditions.push(
        `(u.user_id ILIKE $${queryParams.length} OR u.username ILIKE $${queryParams.length} OR u.email ILIKE $${queryParams.length})`,
      );
    }

    if (country_code) {
      queryParams.push(country_code);
      whereConditions.push(`u.country_code = $${queryParams.length}`);
    }
    if (user_status) {
      queryParams.push(user_status);
      whereConditions.push(`u.user_status = $${queryParams.length}`);
    }
    if (user_role) {
      queryParams.push(user_role);
      whereConditions.push(`u.user_role = $${queryParams.length}`);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // --- 3. Query ข้อมูลพร้อม Sorting ---
    // หมายเหตุ: ตรง ORDER BY เราใช้ตัวแปรที่ผ่านการตรวจ Whitelist แล้วมาใส่โดยตรง
    const usersSql = `
      SELECT 
        u.user_id, u.username, u.email, u.img_path, 
        u.register_date, u.user_status, u.user_role, 
        u.country_code
      FROM app_user u
      ${whereClause}
      ORDER BY u.${actualSortBy} ${actualOrder}
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;

    const countSql = `SELECT COUNT(*) as total FROM app_user u ${whereClause}`;

    const [usersResult, countResult] = await Promise.all([
      pool.query(usersSql, [...queryParams, limit, offset]),
      pool.query(countSql, queryParams),
    ]);

    const totalItems = parseInt(countResult.rows[0].total);

    res.status(200).json({
      data: usersResult.rows,
      pagination: {
        total_items: totalItems,
        total_pages: Math.ceil(totalItems / Number(limit)),
        current_page: Number(page),
        limit: Number(limit),
        sort_by: actualSortBy,
        order: actualOrder,
      },
    });
  } catch (error: any) {
    console.error("Error Fetching Users:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", debug: error.message });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  const { id } = req.params; // ID ของคนที่จะถูกเปลี่ยน
  const { status } = req.body; // 'active', 'suspended', 'banned'

  try {
    // 1. ตรวจสอบก่อนว่าคนที่จะถูกเปลี่ยนเป็นใคร
    const checkUser = await pool.query(
      "SELECT user_role FROM app_user WHERE user_id = $1",
      [id],
    );

    if (checkUser.rowCount === 0) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้นี้ในระบบ" });
    }

    // 2. มาตรฐานจริง: ถ้าคนที่จะถูกแบนเป็น admin ให้ปฏิเสธทันที
    if (checkUser.rows[0].user_role === "admin") {
      return res
        .status(403)
        .json({ message: "คุณไม่สามารถเปลี่ยนสถานะของ Admin ด้วยกันได้" });
    }

    // 3. อัปเดตสถานะ
    await pool.query(
      "UPDATE app_user SET user_status = $1 WHERE user_id = $2",
      [status, id],
    );

    res
      .status(200)
      .json({ message: `อัปเดตสถานะเป็น ${status} เรียบร้อยแล้ว` });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal Server Error", debug: error.message });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body; // 'admin', 'customer'

  try {
    const checkUser = await pool.query(
      "SELECT user_role FROM app_user WHERE user_id = $1",
      [id],
    );

    if (checkUser.rowCount === 0) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้นี้ในระบบ" });
    }

    // 1. ถ้าเขาเป็น admin อยู่แล้ว ไม่ควรไปลดระดับเขา (ยกเว้นจะมี Super Admin)
    if (checkUser.rows[0].user_role === "admin" && role === "customer") {
      return res
        .status(403)
        .json({ message: "ไม่สามารถลดระดับบทบาทของ Admin ได้" });
    }

    // 2. ถ้าเขาเป็น admin อยู่แล้วและจะอัปเดตเป็น admin อีก ก็ไม่ต้องทำอะไร
    if (checkUser.rows[0].user_role === "admin" && role === "admin") {
      return res
        .status(400)
        .json({ message: "ผู้ใช้ท่านนี้เป็น Admin อยู่แล้ว" });
    }

    // 3. อัปเดตบทบาท (ปกติคือโปรโมท Customer -> Admin)
    await pool.query("UPDATE app_user SET user_role = $1 WHERE user_id = $2", [
      role,
      id,
    ]);

    res.status(200).json({ message: `เปลี่ยนบทบาทเป็น ${role} เรียบร้อยแล้ว` });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal Server Error", debug: error.message });
  }
};

export const deleteUsers = async (req: Request, res: Response) => {
  const { userIds } = req.body; // รับเป็น Array ของ ID เช่น ["U00001", "U00002"]

  // 1. ตรวจสอบเบื้องต้นว่าส่งข้อมูลมาไหม
  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ message: "กรุณาเลือกผู้ใช้ที่ต้องการลบ" });
  }

  try {
    // 2. ใช้ SQL Delete พร้อมเงื่อนไขความปลอดภัย
    // - ลบเฉพาะ ID ที่ส่งมา (WHERE user_id = ANY($1))
    // - และต้องไม่ใช่ Admin (AND user_role != 'admin')
    const result = await pool.query(
      "DELETE FROM app_user WHERE user_id = ANY($1) AND user_role != 'admin'",
      [userIds],
    );

    // 3. ตรวจสอบว่ามีการลบจริงไหม
    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "ไม่พบผู้ใช้ที่ต้องการลบ หรือคุณพยายามลบกลุ่ม Admin",
      });
    }

    res.status(200).json({
      message: `ลบผู้ใช้สำเร็จจำนวน ${result.rowCount} คน`,
      deletedCount: result.rowCount,
    });
  } catch (error: any) {
    console.error("Error Deleting Users:", error);
    res.status(500).json({
      message: "Internal Server Error",
      debug: error.message,
    });
  }
};

export const getUserData = async (req: Request, res: Response) => {
  try {
    // 🟢 รับ id จาก params (เนื่องจากเป็น GET request)
    // แต่ยังคงใช้ authenticateToken ในการตรวจสอบสิทธิ์การเข้าถึง
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const query = `
      SELECT 
        u.user_id, 
        u.username, 
        u.email, 
        u.img_path, 
        u.user_status, 
        u.user_role, 
        u.country_code,
        c.country_name
      FROM app_user u
      LEFT JOIN country c ON u.country_code = c.country_code
      WHERE u.user_id = $1;
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateUserData = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // รับ User ID จาก URL
    const { username, img_path, country_code } = req.body;

    // 1. ตรวจสอบข้อมูลเบื้องต้น
    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    // 2. คำสั่ง UPDATE (ไม่รวม password และ email ตามที่ตกลงกัน)
    const query = `
      UPDATE app_user
      SET 
        username = $1,
        img_path = $2,
        country_code = $3
      WHERE user_id = $4
      RETURNING user_id, username, img_path, country_code;
    `;

    const values = [username, img_path, country_code, id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error updating user data:", error);

    // 🟢 Error Handling: เช็คกรณี Username ซ้ำ (Unique Violation - Code 23505)
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "This username is already taken. Please choose another one.",
      });
    }

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { current_password, new_password, confirm_password } = req.body;

    // 1. ตรวจสอบว่าส่งข้อมูลมาครบหรือไม่
    if (!current_password || !new_password || !confirm_password) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกข้อมูลรหัสผ่านให้ครบทุกช่อง",
      });
    }

    // 2. ดึงรหัสผ่านปัจจุบันจากฐานข้อมูลมาเช็ค
    const userQuery = await pool.query(
      "SELECT user_password FROM app_user WHERE user_id = $1",
      [id],
    );
    if (userQuery.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "ไม่พบข้อมูลผู้ใช้งาน" });
    }

    const dbPassword = userQuery.rows[0].user_password;

    // 3. STEP 1: เช็คว่ารหัสเดิมที่กรอกมา ถูกต้องตรงกับใน DB หรือไม่ (เทียบ String ตรงๆ)
    if (current_password !== dbPassword) {
      return res
        .status(401)
        .json({ success: false, message: "รหัสผ่านปัจจุบันไม่ถูกต้อง" });
    }

    // 4. STEP 2: เช็คว่ารหัสใหม่ซ้ำกับรหัสเดิมหรือไม่
    if (new_password === current_password) {
      return res.status(400).json({
        success: false,
        message: "รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านเดิม",
      });
    }

    // 5. STEP 3: เช็คว่ารหัสใหม่กับการยืนยันรหัสผ่านตรงกันหรือไม่
    if (new_password !== confirm_password) {
      return res
        .status(400)
        .json({ success: false, message: "รหัสผ่านใหม่และการยืนยันไม่ตรงกัน" });
    }

    // 6. อัปเดตรหัสผ่านใหม่ลงฐานข้อมูล
    await pool.query(
      "UPDATE app_user SET user_password = $1 WHERE user_id = $2",
      [new_password, id],
    );

    res.status(200).json({
      success: true,
      message: "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว",
    });
  } catch (error) {
    console.error("Update password error:", error);
    res
      .status(500)
      .json({ success: false, message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      username,
      email,
      password,
      confirm_password,
      img_path,
      country_code,
    } = req.body;

    // 1. ตรวจสอบว่ากรอกข้อมูลครบถ้วนหรือไม่
    if (!username || !email || !password || !confirm_password) {
      return res.status(400).json({
        success: false,
        message:
          "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (Username, Email, Password)",
      });
    }

    // 2. เช็คว่ารหัสผ่านและการยืนยันรหัสผ่านตรงกันหรือไม่
    if (password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: "รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน",
      });
    }

    // 3. ตรวจสอบว่า Username หรือ Email เคยมีในระบบแล้วหรือไม่
    const checkUserQuery = `
      SELECT username, email FROM app_user 
      WHERE username = $1 OR email = $2
    `;
    const existingUser = await pool.query(checkUserQuery, [username, email]);

    if (existingUser.rows.length > 0) {
      const found = existingUser.rows[0];
      if (found.username === username) {
        return res
          .status(409)
          .json({ success: false, message: "ชื่อผู้ใช้นี้ถูกใช้งานไปแล้ว" });
      }
      if (found.email === email) {
        return res
          .status(409)
          .json({ success: false, message: "อีเมลนี้ถูกใช้งานไปแล้ว" });
      }
    }

    // 4. ทำการบันทึกข้อมูลผู้ใช้ใหม่ (ใช้ค่า Default สำหรับ status และ role)
    const insertQuery = `
      INSERT INTO app_user (username, email, user_password, img_path, country_code, user_status, user_role)
      VALUES ($1, $2, $3, $4, $5, 'active', 'customer')
      RETURNING user_id, username, email;
    `;

    const result = await pool.query(insertQuery, [
      username,
      email,
      password, // เก็บแบบ Plain text ตามที่ต้องการครับ
      img_path || null,
      country_code || null,
    ]);

    res.status(201).json({
      success: true,
      message: "ลงทะเบียนผู้ใช้สำเร็จ!",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Register Error:", error);
    res
      .status(500)
      .json({ success: false, message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { identifier, new_password, confirm_password } = req.body;

    if (!identifier || !new_password || !confirm_password) {
      return res
        .status(400)
        .json({ success: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    if (new_password !== confirm_password) {
      return res
        .status(400)
        .json({ success: false, message: "รหัสผ่านใหม่ไม่ตรงกัน" });
    }

    // อัปเดตรหัสผ่านโดยเช็คจาก username หรือ email (ใช้รหัสผ่านแบบข้อความตรงๆ)
    const query = `
      UPDATE app_user 
      SET user_password = $1 
      WHERE username = $2 OR email = $2
      RETURNING user_id;
    `;

    const result = await pool.query(query, [new_password, identifier]);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "ไม่พบบัญชีผู้ใช้งานที่ระบุ" });
    }

    res.status(200).json({
      success: true,
      message: "เปลี่ยนรหัสผ่านใหม่สำเร็จแล้ว!",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res
      .status(500)
      .json({ success: false, message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};
