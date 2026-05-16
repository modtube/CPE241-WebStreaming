import type { Request, Response } from "express";
import pool from "../config/db.js";

export const getAllTransactions = async (req: Request, res: Response) => {
  const {
    search,
    page = "1",
    limit = "10",
    sort_by = "transaction_date",
    order = "DESC",
    payment_method,
    status,
  } = req.query;

  const pageNum = Math.max(1, parseInt(page as string));
  const limitNum = Math.max(1, parseInt(limit as string));
  const offset = (pageNum - 1) * limitNum;

  const allowedSortFields: Record<string, string> = {
    transaction_id: "t.transaction_id",
    name: "u.username",
    release_date: "t.transaction_date",
    amount: "t.total_amount",
    payment_method: "t.payment_method",
    status: "t.payment_status",
  };
  const sortField =
    allowedSortFields[sort_by as string] || "t.transaction_date";
  const sortOrder = (order as string).toUpperCase() === "ASC" ? "ASC" : "DESC";

  try {
    const conditions: string[] = [];
    const values: any[] = [];

    if (search) {
      values.push(`%${search}%`);
      conditions.push(`(
        t.transaction_id ILIKE $${values.length} OR
        u.username ILIKE $${values.length}
      )`);
    }

    if (payment_method) {
      values.push(payment_method);
      conditions.push(`t.payment_method = $${values.length}`);
    }

    if (status) {
      values.push(status);
      conditions.push(`t.payment_status = $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const baseQuery = `
      FROM transaction_list t
      LEFT JOIN app_user u ON t.user_id = u.user_id
      ${whereClause}
    `;

    const countResult = await pool.query(
      `SELECT COUNT(*) ${baseQuery}`,
      values,
    );
    const totalItems = parseInt(countResult.rows[0].count);

    values.push(limitNum, offset);
    const dataResult = await pool.query(
      `SELECT
        t.transaction_id,
        COALESCE(u.username, 'Unknown User') AS name,
        t.transaction_date AS release_date,
        t.total_amount AS amount,
        t.payment_method,
        t.payment_status AS status
      ${baseQuery}
      ORDER BY ${sortField} ${sortOrder}
      LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );

    res.status(200).json({
      data: dataResult.rows,
      pagination: {
        total_items: totalItems,
        total_pages: Math.ceil(totalItems / limitNum),
        current_page: pageNum,
        page_size: limitNum,
      },
    });
  } catch (error: any) {
    console.error("Database Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTransactionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const transactionResult = await pool.query(
      `SELECT 
        t.transaction_id,
        t.payment_status AS status,
        t.total_amount,
        t.payment_method,
        COALESCE(u.username, 'Unknown User') AS customer_name,
        COALESCE(u.email, '-') AS customer_email,
        TO_CHAR(t.transaction_date, 'DD Mon YYYY') AS date,
        TO_CHAR(t.transaction_date, 'HH24:MI:SS UTC') AS time
      FROM transaction_list t
      LEFT JOIN app_user u ON t.user_id = u.user_id
      WHERE t.transaction_id = $1`,
      [id],
    );

    if (transactionResult.rows.length === 0) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    const itemsResult = await pool.query(
      `SELECT 
        movie_id,
        movie_name,
        original_price,
        discount_applied AS discount,
        sold_price AS final_price
      FROM transaction_detail
      WHERE transaction_id = $1`,
      [id],
    );

    res.status(200).json({
      ...transactionResult.rows[0],
      items: itemsResult.rows,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const refundTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE transaction_list 
       SET payment_status = 'Refunded' 
       WHERE transaction_id = $1 
       RETURNING *`,
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Transaction not found." });
    }
    res.status(200).json({ message: "Refund successful." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransactionByUserId = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    // 🔒 ระบบความปลอดภัยเพิ่มเติม:
    // ตรวจสอบว่า user_id ที่ส่งมาตรงกับ ID ใน Token หรือไม่ (ถ้าต้องการ)
    // if (req.user.user_id !== user_id) {
    //   return res.status(403).json({ message: "Forbidden: You cannot access other users' data" });
    // }

    const query = `
      SELECT 
        transaction_id,
        transaction_date,
        total_amount,
        payment_method,
        payment_status
      FROM transaction_list
      WHERE user_id = $1
      ORDER BY transaction_date DESC;
    `;

    const result = await pool.query(query, [user_id]);

    // ส่งข้อมูลกลับเป็น Array (ถึงไม่มีข้อมูลก็จะส่ง [] กลับไป)
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getTransactionDetail = async (req: Request, res: Response) => {
  try {
    const { transaction_id } = req.params;

    const query = `
      SELECT 
        movie_name,
        original_price,
        discount_applied,
        sold_price
      FROM transaction_detail
      WHERE transaction_id = $1;
    `;

    const result = await pool.query(query, [transaction_id]);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    // 🟢 เปลี่ยนมารับ user_id จาก body ที่ส่งมาจากหน้าบ้านครับ
    const { user_id, payment_method, items } = req.body;

    if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing user_id or items in transaction",
      });
    }

    await client.query("BEGIN");

    // 1. คำนวณยอดรวม
    const total_amount = items.reduce(
      (sum, item) => sum + Number(item.price),
      0,
    );

    // 2. สร้าง Transaction List (หัวบิล)
    const listQuery = `
      INSERT INTO transaction_list (user_id, total_amount, payment_method, payment_status)
      VALUES ($1, $2, $3, 'Completed')
      RETURNING transaction_id;
    `;
    const listResult = await client.query(listQuery, [
      user_id,
      total_amount,
      payment_method,
    ]);
    const transaction_id = listResult.rows[0].transaction_id;

    // 3. วนลูปสร้าง Detail และเพิ่มเข้า Library
    for (const movie of items) {
      // 3.1 บันทึกรายละเอียด (Detail)
      await client.query(
        `
        INSERT INTO transaction_detail 
        (transaction_id, movie_id, movie_name, original_price, discount_applied, sold_price)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
        [
          transaction_id,
          movie.movie_id,
          movie.title,
          movie.price,
          0,
          movie.price,
        ],
      );

      // 3.2 🟢 เพิ่มหนังเข้า Personal Library โดยใช้ user_id ที่ส่งมาจากหน้าบ้าน
      await client.query(
        `
        INSERT INTO personal_library (user_id, movie_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
      `,
        [user_id, movie.movie_id],
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Transaction completed and items added to library",
      transaction_id: transaction_id,
    });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Transaction Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  } finally {
    client.release();
  }
};
