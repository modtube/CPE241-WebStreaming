import type { Request, Response } from 'express';
import pool from '../config/db.js';

export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT 
        m.movie_id AS id, m.title, r.rating_label AS "ageRating",
        TO_CHAR(m.release_date, 'YYYY') AS year,
        COALESCE((SELECT g.genre_name FROM movie_genre mg JOIN genre g ON mg.genre_id = g.genre_id WHERE mg.movie_id = m.movie_id LIMIT 1), 'Unknown') AS genre,
        COALESCE((SELECT l.language_name FROM movie_resource mr JOIN language_list l ON mr.language_id = l.language_id WHERE mr.movie_id = m.movie_id AND mr.lang_type = 'Audio' LIMIT 1), 'Unknown') AS language,
        m.price, m.img_path AS poster, m.img_path AS backdrop, m.movie_description AS synopsis,
        COALESCE((SELECT ROUND(AVG(rating), 1) FROM reviews rv WHERE rv.movie_id = m.movie_id AND rv.post_status = 'Published'), 0.0) AS score
      FROM movie m
      LEFT JOIN movie_rating r ON m.rating_id = r.rating_id
      ORDER BY m.create_date DESC
    `;
    const result = await pool.query(query);
    const formattedData = result.rows.map(movie => ({
      ...movie,
      stars: Math.round(Number(movie.score))
    }));
    res.status(200).json({ data: formattedData });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// 2. ฟังก์ชันดึงรีวิวของหนังเรื่องนั้นๆ
export const getReviewsByMovie = async (req: Request, res: Response) => {
  const { movieId } = req.params;
  try {
    const query = `
      SELECT 
        r.rating AS stars, 
        r.rating AS score, 
        r.comment_text AS text, 
        TO_CHAR(r.post_time, 'Mon DD, YYYY') AS date,
        COALESCE(u.username, 'Anonymous') AS username,
        COALESCE(u.img_path, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anon') AS avatar
      FROM reviews r
      LEFT JOIN app_user u ON r.user_id = u.user_id
      WHERE r.movie_id = $1 AND r.post_status = 'Published'
      ORDER BY r.post_time DESC
    `;
    const { rows } = await pool.query(query, [movieId]);
    res.json({ data: rows });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// 3. ฟังก์ชันบันทึกรีวิวลง Database
export const addReview = async (req: Request, res: Response) => {
  const { movieId, userId, rating, text } = req.body;
  try {
    const query = `
      INSERT INTO reviews (user_id, movie_id, rating, comment_text, post_status)
      VALUES ($1, $2, $3, $4, 'Published')
      ON CONFLICT (user_id, movie_id) 
      DO UPDATE SET rating = EXCLUDED.rating, comment_text = EXCLUDED.comment_text, post_time = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    
    // ถ้าไม่มี userId ให้ส่งค่าเป็น null
    const safeUserId = userId ? userId : null; 
    await pool.query(query, [safeUserId, movieId, rating, text]);
    
    res.status(201).json({ message: 'Review posted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error saving review', error: error.message });
  }
};