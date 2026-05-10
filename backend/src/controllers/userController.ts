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
