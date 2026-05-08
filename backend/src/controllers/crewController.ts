import type { Request, Response } from 'express';
import pool from '../config/db.js';

export const getAllCrew = async (req: Request, res: Response) => {
  try {
    // ดึงข้อมูลจากตาราง person ของคุณ
    const result = await pool.query('SELECT * FROM person ORDER BY person_id DESC');
    
    // ส่งข้อมูลกลับไปในรูปแบบ JSON (เจสัน)
    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error('Database Error:', error.message);
    res.status(500).json({ message: 'Error fetching crew data' });
  }
};