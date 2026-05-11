import type { Request, Response } from 'express';
import pool from '../config/db.js';

export const getAllTransactions = async (req: Request, res: Response) => {
  const {
    search,
    page = '1',
    limit = '10',
    sort_by = 'transaction_date',
    order = 'DESC',
    payment_method,
    status,
  } = req.query;

  const pageNum = Math.max(1, parseInt(page as string));
  const limitNum = Math.max(1, parseInt(limit as string));
  const offset = (pageNum - 1) * limitNum;

  const allowedSortFields: Record<string, string> = {
    transaction_id: 't.transaction_id',
    name: 'u.username',
    release_date: 't.transaction_date',
    amount: 't.total_amount',
    payment_method: 't.payment_method',
    status: 't.payment_status',
  };
  const sortField = allowedSortFields[sort_by as string] || 't.transaction_date';
  const sortOrder = (order as string).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

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

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const baseQuery = `
      FROM transaction_list t
      LEFT JOIN app_user u ON t.user_id = u.user_id
      ${whereClause}
    `;

    const countResult = await pool.query(
      `SELECT COUNT(*) ${baseQuery}`,
      values
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
      values
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
    console.error('Database Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
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
      [id]
    );

    if (transactionResult.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    const itemsResult = await pool.query(
      `SELECT 
        movie_id,
        movie_name,
        sold_price AS price
      FROM transaction_detail
      WHERE transaction_id = $1`,
      [id]
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
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }
    res.status(200).json({ message: 'Refund successful.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};