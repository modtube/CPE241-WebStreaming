import type { Request, Response } from "express";
import pool from "../config/db.js";

/**
 * Playlist Controller (User-facing)
 * จัดการ playlist ของ user — User Playlist page
 *
 * Schema สำคัญ:
 *   playlist: PRIMARY KEY (user_id, playlist_name)
 *   playlist_item: PRIMARY KEY (user_id, playlist_name, movie_id)
 *   visibility CHECK ('Public', 'Unlisted', 'Hidden')
 */

const VALID_VISIBILITIES = ["Public", "Unlisted", "Hidden"] as const;
type Visibility = (typeof VALID_VISIBILITIES)[number];

/* =============================================================================
 * GET /api/users/:userId/playlists
 * Query playlist ทุกอันของ user (เอาแค่ attribute ที่เป็นของตัวเอง)
 * + นับจำนวน item ในแต่ละ playlist เพื่อแสดงในการ์ดของหน้า Playlist
 * ===========================================================================*/
export const getMyPlaylists = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const sql = `
      SELECT
        p.user_id,
        p.playlist_name,
        p.create_date,
        p.visibility,
        (SELECT COUNT(*)::int FROM playlist_item pi
         WHERE pi.user_id = p.user_id AND pi.playlist_name = p.playlist_name) AS item_count
      FROM playlist p
      WHERE p.user_id = $1
      ORDER BY p.create_date DESC;
    `;
    const result = await pool.query(sql, [userId]);
    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("Error in getMyPlaylists:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึง playlists" });
  }
};

/* =============================================================================
 * GET /api/users/:userId/playlists/:playlistName/items
 * Query playlist-item ทุกอันที่เป็นของ playlist นั้น + ข้อมูลหนังที่เชื่อม
 * ===========================================================================*/
export const getPlaylistItems = async (req: Request, res: Response) => {
  try {
    const { userId, playlistName } = req.params;

    const sql = `
      SELECT
        pi.user_id,
        pi.playlist_name,
        pi.movie_id,
        pi.add_date,
        m.title,
        m.img_path,
        m.release_date,
        EXTRACT(YEAR FROM m.release_date)::int AS year,
        m.price,
        mr.rating_label AS rating,
        (SELECT COALESCE(JSON_AGG(g.genre_name), '[]'::json)
           FROM movie_genre mg
           JOIN genre g ON mg.genre_id = g.genre_id
          WHERE mg.movie_id = m.movie_id) AS genres,
        (SELECT COALESCE(ROUND(AVG(rv.rating), 1), 0)::float
           FROM reviews rv WHERE rv.movie_id = m.movie_id) AS average_rating
      FROM playlist_item pi
      JOIN movie m ON pi.movie_id = m.movie_id
      LEFT JOIN movie_rating mr ON m.rating_id = mr.rating_id
      WHERE pi.user_id = $1 AND pi.playlist_name = $2
      ORDER BY pi.add_date DESC;
    `;
    const result = await pool.query(sql, [userId, playlistName]);
    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("Error in getPlaylistItems:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึง playlist items" });
  }
};

/* =============================================================================
 * POST /api/users/:userId/playlists
 * สร้าง playlist ใหม่
 * Body: { playlist_name, visibility? }
 * ===========================================================================*/
export const createPlaylist = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { playlist_name, visibility } = req.body as {
      playlist_name?: string;
      visibility?: string;
    };

    if (!playlist_name || !playlist_name.trim()) {
      res.status(400).json({ message: "ต้องระบุ playlist_name" });
      return;
    }
    const vis: Visibility =
      visibility && (VALID_VISIBILITIES as readonly string[]).includes(visibility)
        ? (visibility as Visibility)
        : "Hidden";

    try {
      const result = await pool.query(
        `INSERT INTO playlist (user_id, playlist_name, visibility)
         VALUES ($1, $2, $3)
         RETURNING *;`,
        [userId, playlist_name.trim(), vis]
      );
      res.status(201).json({
        message: "สร้าง playlist สำเร็จ",
        playlist: result.rows[0],
      });
    } catch (dbError) {
      const code = (dbError as { code?: string }).code;
      if (code === "23505") {
        res.status(409).json({ message: "playlist ชื่อนี้มีอยู่แล้ว" });
        return;
      }
      if (code === "23503") {
        res.status(404).json({ message: "ไม่พบ user" });
        return;
      }
      throw dbError;
    }
  } catch (error) {
    console.error("Error in createPlaylist:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการสร้าง playlist" });
  }
};

/* =============================================================================
 * POST /api/users/:userId/playlists/:playlistName/items
 * เพิ่ม movie เข้า playlist
 * Body: { movie_id }
 * ===========================================================================*/
export const addPlaylistItem = async (req: Request, res: Response) => {
  try {
    const { userId, playlistName } = req.params;
    const { movie_id } = req.body as { movie_id?: string };

    if (!movie_id) {
      res.status(400).json({ message: "ต้องระบุ movie_id" });
      return;
    }

    try {
      const result = await pool.query(
        `INSERT INTO playlist_item (user_id, playlist_name, movie_id)
         VALUES ($1, $2, $3)
         RETURNING *;`,
        [userId, playlistName, movie_id]
      );
      res.status(201).json({
        message: "เพิ่มหนังเข้า playlist สำเร็จ",
        item: result.rows[0],
      });
    } catch (dbError) {
      const code = (dbError as { code?: string }).code;
      if (code === "23505") {
        res.status(409).json({ message: "หนังนี้อยู่ใน playlist แล้ว" });
        return;
      }
      if (code === "23503") {
        res.status(404).json({ message: "ไม่พบ playlist หรือ movie" });
        return;
      }
      throw dbError;
    }
  } catch (error) {
    console.error("Error in addPlaylistItem:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
};

/* =============================================================================
 * DELETE /api/users/:userId/playlists/:playlistName/items/:movieId
 * ลบ playlist-item ออกจาก playlist
 * ===========================================================================*/
export const deletePlaylistItem = async (req: Request, res: Response) => {
  try {
    const { userId, playlistName, movieId } = req.params;

    const result = await pool.query(
      `DELETE FROM playlist_item
       WHERE user_id = $1 AND playlist_name = $2 AND movie_id = $3
       RETURNING *;`,
      [userId, playlistName, movieId]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: "ไม่พบ item นี้ใน playlist" });
      return;
    }
    res.status(200).json({ message: "ลบหนังออกจาก playlist สำเร็จ" });
  } catch (error) {
    console.error("Error in deletePlaylistItem:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
};

/* =============================================================================
 * DELETE /api/users/:userId/playlists/:playlistName
 * ลบ playlist (item ทั้งหมดข้างในจะถูกลบด้วยเพราะ ON DELETE CASCADE)
 * ===========================================================================*/
export const deletePlaylist = async (req: Request, res: Response) => {
  try {
    const { userId, playlistName } = req.params;

    const result = await pool.query(
      `DELETE FROM playlist
       WHERE user_id = $1 AND playlist_name = $2
       RETURNING *;`,
      [userId, playlistName]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: "ไม่พบ playlist" });
      return;
    }
    res.status(200).json({ message: "ลบ playlist สำเร็จ" });
  } catch (error) {
    console.error("Error in deletePlaylist:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
};
