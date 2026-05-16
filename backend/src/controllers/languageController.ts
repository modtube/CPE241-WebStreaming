import type { Request, Response } from "express";
import pool from "../config/db.js";

export const getAllLanguages = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM language_list");

    if (!result || result.rows.length === 0) {
      return res.status(200).json({ data: [], message: "No languages found" });
    }

    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("Error: ", error);
    res
      .status(500)
      .json({ message: "Getting Languages: Internal Server Issue" });
  }
};

export const addLanguage = async (req: Request, res: Response) => {
  const { language_name, native_name } = req.body;
  try {
    const result = await pool.query(
      `
        INSERT INTO language_list (language_name, native_name)
        VALUES ($1, $2)
        RETURNING *;
      `,
      [language_name, native_name],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: `Adding Languages: ${error}` });
  }
};

export const updateLanguage = async (req: Request, res: Response) => {
  const { language_id } = req.params;
  const { language_name, native_name } = req.body;

  if (!language_name) {
    return res.status(400).json({ message: "กรุณาระบุ Language Name" });
  }
  if (!native_name) {
    return res.status(400).json({ message: "กรุณาระบุ Native Name" });
  }

  try {
    const result = await pool.query(
      `
      UPDATE language_list
      SET language_name = $1, native_name = $2
      WHERE language_id = $3
      RETURNING *;
      `,
      [language_name, native_name, language_id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Language Not Found!" });
    }

    res.status(200).json({
      message: "Updated Successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: `Updating Language: ${error}` });
  }
};

export const deleteLanguage = async (req: Request, res: Response) => {
  const { language_id } = req.params;
  try {
    const result = await pool.query(
      `
        DELETE FROM language_list
        WHERE language_id = $1
        RETURNING *;
      `,
      [language_id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Language Not Found!" });
    }

    res.status(200).json({ message: "Language Deleted Successfully" });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: `Deleting Language: ${error}` });
  }
};

export const getLanguageById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // รับค่า L001 จาก URL path

    const query = `
      SELECT 
        language_id,
        language_name,
        native_name
      FROM language_list
      WHERE language_id = $1
    `;

    const result = await pool.query(query, [id]);

    // ตรวจสอบว่าพบข้อมูลหรือไม่
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Language not found" });
    }

    // ส่งข้อมูลภาษาแรกที่พบกลับไป
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching language:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
