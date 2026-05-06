import type { Request, Response } from 'express';
import pool from '../config/db.js'; // ต้องมี .js เพราะเราใช้ ESM คับ

export const getAllMovies = async (req: Request, res: Response) => {
  try {
    // ใช้ pool.query เพื่อรัน SQL ตรงๆ
    // ตรวจสอบชื่อตารางในฐานข้อมูลของคุณด้วยนะคับ (สมมติว่าชื่อ movies)
    const result = await pool.query('SELECT * FROM movie WHERE movie_id=1');
    
    // ส่งข้อมูลกลับไปหา Postman หรือ Frontend
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลหนัง' });
  }
};