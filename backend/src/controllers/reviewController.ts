import type { Request, Response } from "express";
import pool from "../config/db.js";

export const getAllReviews = async (req: Request, res: Response) => {
  const { movie, user } = req.query;

  try {
    let sql = "SELECT * FROM reviews WHERE 1=1"; // เทคนิค 1=1 ช่วยให้ต่อ AND ได้ง่ายขึ้น
    let queryParams: any[] = [];
    let counter = 1;

    if (movie) {
      sql += ` AND movie_id = $${counter}`;
      queryParams.push(movie);
      counter++;
    }

    if (user) {
      sql += ` AND user_id = $${counter}`;
      queryParams.push(user);
      counter++;
    }

    sql += " ORDER BY post_time DESC";

    const result = await pool.query(sql, queryParams);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Getting Reviews: Internal Server Issue" });
  }
};

// หาว่าหนังเรื่อง
export const getTotalMovieReview = async (req: Request, res: Response) => {
  const movieId = req.query.movie; // รับค่าจาก ?movie=[...]

  // ตรวจสอบว่ามีการส่ง movieId มาหรือไม่
  if (!movieId) {
    return res.status(400).json({ message: "กรุณาระบุรหัสหนัง (movie_id)" });
  }

  try {
    // ใช้ Aggregate Functions (COUNT และ AVG) ในการคำนวณจากตาราง reviews
    const result = await pool.query(
      `SELECT 
        COUNT(*)::int AS total_reviews, 
        COALESCE(ROUND(AVG(rating), 1), 0)::float AS average_rating 
      FROM reviews 
      WHERE movie_id = $1`,
      [movieId],
    );

    // ผลลัพธ์จาก COUNT/AVG จะส่งกลับมา 1 row เสมอ (แม้จะไม่มีข้อมูลก็ตาม)
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error calculating movie reviews: ", error);
    res
      .status(500)
      .json({ message: "Internal Server Error: ไม่สามารถคำนวณข้อมูลรีวิวได้" });
  }
};
