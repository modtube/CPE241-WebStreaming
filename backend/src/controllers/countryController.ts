import type { Request, Response } from "express";
import pool from "../config/db.js";

export const getAllCountries = async (req: Request, res: Response) => {
  try {
    // ดึงข้อมูลทั้งหมดจากตาราง country และเรียงตามชื่อประเทศเพื่อให้เลือกง่าย
    const result = await pool.query(
      "SELECT country_code, country_name FROM country ORDER BY country_name ASC",
    );

    res.status(200).json({
      data: result.rows || [],
    });
  } catch (error: any) {
    console.error("Error Fetching Countries:", error);
    res.status(500).json({
      message: "ไม่สามารถดึงข้อมูลประเทศได้",
      debug: error.message,
    });
  }
};

export const addCountry = async (req: Request, res: Response) => {
  const { country_code, country_name } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO country 
       (country_code, country_name) 
       VALUES ($1, $2) 
       RETURNING *`,
      [country_code, country_name],
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error("Error Fetching Countries:", error);
    res.status(500).json({
      message: "ไม่สามารถเพิ่มข้อมูลประเทศได้",
      debug: error.message,
    });
  }
};

export const updateCountry = async (req: Request, res: Response) => {
  const { country_code } = req.params;
  const { country_name } = req.body;

  if (!country_name) {
    return res
      .status(400)
      .json({ message: "กรุณาระบุชื่อ Country ที่ต้องการแก้ไข" });
  }

  try {
    const result = await pool.query(
      `
      UPDATE country
      SET country_name = $1
      WHERE country_code = $2
      RETURNING *;
      `,
      [country_name, country_code],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Country Not Found!" });
    }

    res.status(200).json({
      message: "Updated Successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: `Updating Country: ${error}` });
  }
};

export const deleteCountry = async (req: Request, res: Response) => {
  const { country_code } = req.params;
  try {
    const result = await pool.query(
      `
        DELETE FROM country
        WHERE country_code = $1
        RETURNING *;
      `,
      [country_code],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Country Not Found!" });
    }

    res.status(200).json({ message: "Country Deleted Successfully" });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: `Deleting Country: ${error}` });
  }
};
