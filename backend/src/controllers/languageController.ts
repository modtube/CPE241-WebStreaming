import type { Request, Response } from "express";
import pool from "../config/db.js";

export const getAllLanguages = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM language_list");

    if (!result || result.rows.length === 0) {
      return res.status(500).json({ message: "Language Not Found!" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error: ", error);
    res
      .status(500)
      .json({ message: "Getting Languages: Internal Server Issue" });
  }
};
