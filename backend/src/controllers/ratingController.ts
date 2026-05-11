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

export const updateRating = async (req: Request, res: Response) => {
  const { rating_id } = req.params;
  const { rating_label, maturity_level, rating_description } = req.body;

  if (!rating_label) {
    return res.status(400).json({ message: "กรุณาระบุ Rating Label" });
  }
  if (!maturity_level) {
    return res.status(400).json({ message: "กรุณาระบุ Maturity Level" });
  }

  if (!rating_description) {
    return res.status(400).json({ message: "กรุณาระบุ Rating Description" });
  }

  try {
    const result = await pool.query(
      `
      UPDATE movie_rating
      SET rating_label = $1, maturity_level = $2, rating_description = $3
      WHERE rating_id = $4
      RETURNING *;
      `,
      [rating_label, maturity_level, rating_description, rating_id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Rating Not Found!" });
    }

    res.status(200).json({
      message: "Updated Successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: `Updating Ratings: ${error}` });
  }
};

export const deleteRating = async (req: Request, res: Response) => {
  const { rating_id } = req.params;
  try {
    const result = await pool.query(
      `
        DELETE FROM movie_rating
        WHERE rating_id = $1
        RETURNING *;
      `,
      [rating_id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Rating Not Found!" });
    }

    res.status(200).json({ message: "Rating Deleted Successfully" });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: `Deleting Rating: ${error}` });
  }
};
