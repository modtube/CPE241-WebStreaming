import type { Request, Response } from "express";
import pool from "../config/db.js";

export const getAllPersons = async (req: Request, res: Response) => {
  const movieId = req.query.movie; // รับค่า ?movie=... จาก URL

  try {
    let result;

    if (movieId) {
      // กรณีมี parameter movie ให้ Join กับตาราง movie_role เพื่อกรองตาม movie_id
      result = await pool.query(
        `SELECT DISTINCT p.* FROM person p 
         JOIN movie_role mr ON p.person_id = mr.person_id 
         WHERE mr.movie_id = $1`,
        [movieId],
      );
    } else {
      // กรณีไม่มี parameter ให้ดึงข้อมูล person ทั้งหมดเหมือนเดิม
      result = await pool.query("SELECT * FROM person");
    }

    if (!result || result.rows.length === 0) {
      return res.status(200).json({ data: [], message: "No persons found!" });
    }

    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Getting Persons: Internal Server Issue" });
  }
};
