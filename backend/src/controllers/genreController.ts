import type { Request, Response } from "express";
import pool from "../config/db.js";

export const getAllGenres = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM genre");

    if (!result || result.rows.length === 0) {
      return res.status(200).json({ data: [], message: "No genres found" });
    }

    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Getting Genres: Internal Server Issue" });
  }
};

export const addGenre = async (req: Request, res: Response) => {
  const { genre_name } = req.body;
  try {
    const result = await pool.query(
      `
      INSERT INTO genre (genre_name)
      VALUES ($1)
      RETURNING *;
      `,
      [genre_name],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: `Adding Genres: ${error}` });
  }
};

export const updateGenre = async (req: Request, res: Response) => {
  const { genre_id } = req.params;
  const { genre_name } = req.body;

  if (!genre_name) {
    return res
      .status(400)
      .json({ message: "กรุณาระบุชื่อ Genre ที่ต้องการแก้ไข" });
  }

  try {
    const result = await pool.query(
      `
      UPDATE genre
      SET genre_name = $1
      WHERE genre_id = $2
      RETURNING *;
      `,
      [genre_name, genre_id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Genre Not Found!" });
    }

    res.status(200).json({
      message: "Updated Successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: `Updating Genres: ${error}` });
  }
};

export const deleteGenre = async (req: Request, res: Response) => {
  const { genre_id } = req.params;
  try {
    const result = await pool.query(
      `
        DELETE FROM genre
        WHERE genre_id = $1
        RETURNING *;
      `,
      [genre_id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Genre Not Found!" });
    }

    res.status(200).json({ message: "Genre Deleted Successfully" });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: `Deleting Genre: ${error}` });
  }
};
