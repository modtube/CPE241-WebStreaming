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
