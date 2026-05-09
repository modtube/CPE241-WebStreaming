import type { Request, Response } from "express";
import pool from "../config/db.js";

export const getAllGenres = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM genre");

    if (!result || result.rows.length === 0) {
      return res.status(500).json({ message: "Genre Not Found!" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Getting Genres: Internal Server Issue" });
  }
};
