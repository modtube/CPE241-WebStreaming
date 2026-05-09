import type { Request, Response } from "express";
import pool from "../config/db.js";

export const getAllRatings = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM movie_rating");

    if (!result || result.rows.length === 0) {
      return res.status(500).json({ message: "Movie Rating Not Found!" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Getting Ratings: Internal Server Issue" });
  }
};
