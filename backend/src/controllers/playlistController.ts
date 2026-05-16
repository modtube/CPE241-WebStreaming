import type { Request, Response } from "express";
import pool from "../config/db.js";

export const getMyPlaylists = async (req: any, res: Response) => {
  try {
    // ดึง userId ออกมาจาก req.user (ที่ฝากมาจาก middleware)
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT 
    p.playlist_name,
    p.create_date,
    p.visibility,
    COUNT(pi.movie_id) AS total_movies
FROM playlist p
LEFT JOIN playlist_item pi 
    ON p.user_id = pi.user_id 
    AND p.playlist_name = pi.playlist_name
WHERE p.user_id = $1
GROUP BY 
    p.user_id,
    p.playlist_name, 
    p.create_date, 
    p.visibility
ORDER BY p.create_date DESC;`,
      [userId],
    );

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error}` });
  }
};

// controllers/playlistController.ts
export const getPlaylistItems = async (req: any, res: Response) => {
  try {
    // 1. ดึง playlist_name จาก Query Parameters
    const { playlist_name } = req.query;

    // 2. ดึง userId จาก req.user (ที่ได้จาก authenticateToken middleware)
    const userId = req.user.userId;

    if (!playlist_name) {
      return res.status(400).json({ message: "Missing playlist_name" });
    }

    const query = `
      SELECT 
        m.movie_id, 
        m.title, 
        m.img_path, 
        m.release_date,
        pi.add_date
      FROM playlist_item pi
      JOIN movie m ON pi.movie_id = m.movie_id
      WHERE pi.user_id = $1 
        AND pi.playlist_name = $2
      ORDER BY pi.add_date DESC;
    `;

    const result = await pool.query(query, [userId, playlist_name]);

    // ส่งข้อมูลรายการหนังในเพลย์ลิสต์กลับไป
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching playlist items:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// controllers/playlistController.ts
export const createPlaylist = async (req: Request, res: Response) => {
  try {
    // 🟢 เปลี่ยนมารับ user_id จาก req.body แทน
    const { user_id, playlist_name, visibility } = req.body;

    if (!user_id || !playlist_name || !visibility) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const query = `
      INSERT INTO playlist (user_id, playlist_name, visibility)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const values = [user_id, playlist_name, visibility];
    const result = await pool.query(query, values);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deletePlaylist = async (req: Request, res: Response) => {
  try {
    // 🟢 เปลี่ยนมารับ user_id จาก req.body แทน
    const { user_id, playlist_name } = req.body;

    if (!user_id || !playlist_name) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const query = `
      DELETE FROM playlist
      WHERE user_id = $1 AND playlist_name = $2
      RETURNING *;
    `;

    const values = [user_id, playlist_name];
    const result = await pool.query(query, values);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const addMovieToPlaylist = async (req: Request, res: Response) => {
  try {
    const { user_id, playlist_name, movie_id } = req.body;

    // 1. ตรวจสอบข้อมูลเบื้องต้น
    if (!user_id || !playlist_name || !movie_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: user_id, playlist_name, or movie_id",
      });
    }

    // 2. เช็คว่าผู้ใช้มีหนังเรื่องนี้ใน personal_library จริงหรือไม่
    const libraryCheck = await pool.query(
      `SELECT * FROM personal_library WHERE user_id = $1 AND movie_id = $2`,
      [user_id, movie_id],
    );

    if (libraryCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message:
          "You don't own this movie. You can only add purchased movies to a playlist.",
      });
    }

    // 3. ตรวจสอบว่า Playlist นี้เป็นของผู้ใช้คนนี้จริงหรือไม่
    const playlistCheck = await pool.query(
      `SELECT * FROM playlist WHERE user_id = $1 AND playlist_name = $2`,
      [user_id, playlist_name],
    );

    if (playlistCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    // 4. เพิ่มหนังเข้า playlist_item
    const insertQuery = `
      INSERT INTO playlist_item (user_id, playlist_name, movie_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const result = await pool.query(insertQuery, [
      user_id,
      playlist_name,
      movie_id,
    ]);

    res.status(201).json({
      success: true,
      message: "Movie added to playlist successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error adding movie to playlist:", error);

    // กรณีหนังอยู่ใน Playlist อยู่แล้ว (Unique Violation)
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "This movie is already in the playlist",
      });
    }

    res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error}`,
    });
  }
};

export const deleteMovieFromPlaylist = async (req: Request, res: Response) => {
  try {
    const { user_id, playlist_name, movie_id } = req.body;

    // 1. ตรวจสอบว่าส่งข้อมูลมาครบถ้วนหรือไม่
    if (!user_id || !playlist_name || !movie_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: user_id, playlist_name, or movie_id",
      });
    }

    // 2. ตรวจสอบว่าเพลย์ลิสต์นี้เป็นของผู้ใช้จริงหรือไม่
    const playlistCheck = await pool.query(
      `SELECT * FROM playlist WHERE user_id = $1 AND playlist_name = $2`,
      [user_id, playlist_name],
    );

    if (playlistCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found or you don't have permission to access it",
      });
    }

    // 3. ตรวจสอบว่ามีหนังเรื่องนี้อยู่ในเพลย์ลิสต์จริงๆ หรือไม่
    const itemCheck = await pool.query(
      `SELECT * FROM playlist_item 
       WHERE user_id = $1 AND playlist_name = $2 AND movie_id = $3`,
      [user_id, playlist_name, movie_id],
    );

    if (itemCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "This movie is not in the specified playlist",
      });
    }

    // 4. ทำการลบหนังออกจากตาราง playlist_item
    const deleteQuery = `
      DELETE FROM playlist_item 
      WHERE user_id = $1 AND playlist_name = $2 AND movie_id = $3
      RETURNING *;
    `;

    const result = await pool.query(deleteQuery, [
      user_id,
      playlist_name,
      movie_id,
    ]);

    res.status(200).json({
      success: true,
      message: "Movie removed from playlist successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error deleting movie from playlist:", error);
    res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error}`,
    });
  }
};
