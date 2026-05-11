import type { Request, Response } from "express";
import pool from "../config/db.js";

export const getAllCountries = async (req: Request, res: Response) => {
  try {
    // ดึงข้อมูลทั้งหมดจากตาราง country และเรียงตามชื่อประเทศเพื่อให้เลือกง่าย
    const result = await pool.query(
      "SELECT country_code, country_name FROM country ORDER BY country_name ASC",
    );

    res.status(200).json({
      data: result.rows,
    });
  } catch (error: any) {
    console.error("Error Fetching Countries:", error);
    res.status(500).json({
      message: "ไม่สามารถดึงข้อมูลประเทศได้",
      debug: error.message,
    });
  }
};
