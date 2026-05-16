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

export const getPersonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // รับ P00001 จาก URL

    const query = `
      SELECT 
        person_id,
        img_path,
        first_name,
        middle_name,
        last_name,
        nationality,
        birth_date,
        birth_place,
        biography,
        create_date,
        update_date
      FROM person
      WHERE person_id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Person not found" });
    }

    // ส่งข้อมูล object แรกกลับไป
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching person:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
