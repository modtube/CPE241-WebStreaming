import type { Request, Response } from 'express';
import pool from '../config/db.js';

// 1. ลูกค้าดึงรีวิวเฉพาะของหนังเรื่องที่กำลังดู
export const getMovieReviews = async (req: Request, res: Response) => {
  const { movieId } = req.params;
  try {
    const query = `
      SELECT 
        r.rating AS stars, 
        r.comment_text AS text, 
        TO_CHAR(r.post_time, 'Mon DD, YYYY') AS date,
        u.username,
        u.img_path AS avatar
      FROM reviews r
      LEFT JOIN app_user u ON r.user_id = u.user_id
      WHERE r.movie_id = $1 AND r.post_status = 'Published'
      ORDER BY r.post_time DESC
    `;
    const { rows } = await pool.query(query, [movieId]);
    res.json({ data: rows });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

// 2. ลูกค้าเขียนหรือแก้ไขรีวิวตัวเอง (UPSERT)
export const upsertReview = async (req: Request, res: Response) => {
  const { movieId, userId, rating, text } = req.body;
  try {
    const sql = `
      INSERT INTO reviews (user_id, movie_id, rating, comment_text, post_status)
      VALUES ($1, $2, $3, $4, 'Published')
      ON CONFLICT (user_id, movie_id) 
      DO UPDATE SET rating = EXCLUDED.rating, comment_text = EXCLUDED.comment_text, post_time = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    await pool.query(sql, [userId || null, movieId, rating, text]);
    res.status(201).json({ message: 'Review saved!' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error saving review' });
  }
};