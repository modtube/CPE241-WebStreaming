import type { Request, Response } from "express";
import pool from "../config/db.js";

export const getAllRatings = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM movie_rating");

    if (!result || result.rows.length === 0) {
      return res.status(200).json({ data: [], message: "No ratings found" });
    }

    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Getting Ratings: Internal Server Issue" });
  }
};

export const addRating = async (req: Request, res: Response) => {
  const { rating_label, maturity_level, rating_description } = req.body;
  try {
    const result = await pool.query(
      `
      INSERT INTO movie_rating (rating_label, maturity_level, rating_description)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [rating_label, maturity_level, rating_description || null],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: `Adding Ratings: ${error}` });
  }
};
