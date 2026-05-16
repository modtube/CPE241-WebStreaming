import type { Request, Response } from "express";
import pool from "../config/db.js"; // ต้องมี .js เพราะเราใช้ ESM คับ

/**
 * Reviews controller
 * Schema (admin branch): review_id, user_id, movie_id เป็น VARCHAR(10)
 * เก็บค่าเป็น "V00001", "U00001", "M00001" ตรงๆ ใน DB ไม่มีการแปลง
 */

// ค่าที่ post_status ในตาราง reviews อนุญาต ตาม CHECK constraint ใน 01_schema.sql
const VALID_STATUSES = ["Published", "Hidden", "Removed"] as const;
type ReviewStatus = (typeof VALID_STATUSES)[number];

// Whitelist column ที่ filter ผ่าน query string ได้ (กัน SQL injection)
const FILTERABLE_COLUMNS = [
  "post_status",
  "user_id",
  "movie_id",
  "rating",
] as const;

// Whitelist column ที่ sort ได้
const ALLOWED_SORT_COLUMNS = [
  "review_id",
  "user_id",
  "movie_id",
  "rating",
  "post_status",
  "post_time",
] as const;

/** Helper: รับค่าจาก query string ที่อาจเป็น string หรือ array — เอาตัวแรก */
function pickFirst(v: unknown): string | undefined {
  if (v === undefined || v === null) return undefined;
  if (Array.isArray(v)) return v[0] as string | undefined;
  return String(v);
}

/* =============================================================================
 * GET /api/reviews
 * Query params (optional ทั้งหมด):
 *   - post_status   filter (Published / Hidden / Removed)
 *   - user_id       filter เช่น "U00002"
 *   - movie_id      filter เช่น "M00023"
 *   - rating        filter เช่น 5.0
 *   - search        ค้นใน comment_text (ILIKE)
 *   - search_id     ค้นจาก review_id / user_id / movie_id (ILIKE)
 *   - sort_by       review_id | user_id | movie_id | rating | post_status | post_time
 *   - sort_order    asc | desc (default desc)
 *   - page          default 1
 *   - limit         default 20, max 100
 *
 * Response:
 *   { data: [...], total: N, page, limit, total_pages }
 * ===========================================================================*/
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const conditions: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    // ----- Filter -----
    for (const col of FILTERABLE_COLUMNS) {
      const value = pickFirst(req.query[col]);
      if (value === undefined || value === "") continue;
      conditions.push(`r.${col} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }

    // ----- Search keyword ใน comment_text -----
    const search = pickFirst(req.query.search);
    if (search) {
      conditions.push(`r.comment_text ILIKE $${paramIndex}`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    // ----- Search by ID (ค้นทั้ง review/user/movie) -----
    const searchId = pickFirst(req.query.search_id);
    if (searchId) {
      conditions.push(
        `(r.review_id ILIKE $${paramIndex} OR r.user_id ILIKE $${paramIndex} OR r.movie_id ILIKE $${paramIndex})`,
      );
      values.push(`%${searchId}%`);
      paramIndex++;
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    // ----- Sort (whitelist เพื่อกัน SQL injection ใน ORDER BY) -----
    const sortByRaw = pickFirst(req.query.sort_by);
    const sortBy =
      sortByRaw &&
      (ALLOWED_SORT_COLUMNS as readonly string[]).includes(sortByRaw)
        ? sortByRaw
        : "post_time";
    const sortOrder =
      pickFirst(req.query.sort_order) === "asc" ? "ASC" : "DESC";
    const orderClause = `ORDER BY r.${sortBy} ${sortOrder}`;

    // ----- Pagination -----
    const limitRaw = parseInt(pickFirst(req.query.limit) ?? "", 10);
    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0 && limitRaw <= 100
        ? limitRaw
        : 20;
    const pageRaw = parseInt(pickFirst(req.query.page) ?? "", 10);
    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
    const offset = (page - 1) * limit;

    // Query 1: นับจำนวนทั้งหมด (สำหรับ "Showing X to Y of Z")
    const countSql = `
      SELECT COUNT(*) AS total
      FROM reviews r
      ${whereClause};
    `;
    const countResult = await pool.query(countSql, values);
    const total = parseInt(countResult.rows[0].total, 10);

    // Query 2: ดึงข้อมูลของหน้านี้
    const dataSql = `
      SELECT
        r.review_id,
        r.user_id,
        u.username,
        r.movie_id,
        m.title AS movie_title,
        r.rating,
        r.comment_text,
        r.post_time,
        r.post_status
      FROM reviews r
      LEFT JOIN app_user u ON r.user_id = u.user_id
      LEFT JOIN movie m ON r.movie_id = m.movie_id
      ${whereClause}
      ${orderClause}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1};
    `;
    const dataResult = await pool.query(dataSql, [...values, limit, offset]);

    res.status(200).json({
      data: dataResult.rows,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error in getAllReviews:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล reviews" });
  }
};

/* =============================================================================
 * POST /api/reviews
 * Body: { user_id, movie_id, rating, comment_text? }
 * ===========================================================================*/
// export const createReview = async (req: Request, res: Response) => {
//   try {
//     const { user_id, movie_id, rating, comment_text } = req.body as {
//       user_id?: string;
//       movie_id?: string;
//       rating?: string | number;
//       comment_text?: string | null;
//     };

//     if (!user_id || typeof user_id !== "string") {
//       res.status(400).json({ message: "user_id ไม่ถูกต้อง" });
//       return;
//     }
//     if (!movie_id || typeof movie_id !== "string") {
//       res.status(400).json({ message: "movie_id ไม่ถูกต้อง" });
//       return;
//     }

//     const ratingNum =
//       typeof rating === "number" ? rating : parseFloat(String(rating));
//     if (!Number.isFinite(ratingNum) || ratingNum < 1.0 || ratingNum > 5.0) {
//       res
//         .status(400)
//         .json({ message: "rating ต้องเป็นเลขระหว่าง 1.0 ถึง 5.0" });
//       return;
//     }

//     const commentText =
//       comment_text === undefined || comment_text === null || comment_text === ""
//         ? null
//         : String(comment_text);

//     // review_id auto-generate จาก DEFAULT 'V' || nextval(...)
//     const sql = `
//       INSERT INTO reviews (user_id, movie_id, rating, comment_text, post_status)
//       VALUES ($1, $2, $3, $4, 'Published')
//       RETURNING *;
//     `;

//     try {
//       const result = await pool.query(sql, [
//         user_id,
//         movie_id,
//         ratingNum,
//         commentText,
//       ]);
//       res.status(201).json({
//         message: "เพิ่ม review เรียบร้อย",
//         review: result.rows[0],
//       });
//     } catch (dbError) {
//       const code = (dbError as { code?: string }).code;
//       if (code === "23505") {
//         res
//           .status(409)
//           .json({ message: "ผู้ใช้คนนี้ได้รีวิวหนังเรื่องนี้ไปแล้ว" });
//         return;
//       }
//       if (code === "23503") {
//         res.status(404).json({ message: "ไม่พบ user หรือ movie ที่ระบุ" });
//         return;
//       }
//       if (code === "23514") {
//         res.status(400).json({ message: "rating ไม่ถูกต้องตามข้อกำหนด" });
//         return;
//       }
//       throw dbError;
//     }
//   } catch (error) {
//     console.error("Error in createReview:", error);
//     res.status(500).json({ message: "เกิดข้อผิดพลาดในการเพิ่ม review" });
//   }
// };

/* =============================================================================
 * PATCH /api/reviews/:reviewId/status
 * Body: { post_status: "Published" | "Hidden" | "Removed" }
 * ===========================================================================*/
export const updateReviewStatus = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.reviewId;
    if (!reviewId || typeof reviewId !== "string") {
      res.status(400).json({ message: "review id ไม่ถูกต้อง" });
      return;
    }

    const { post_status } = req.body as { post_status?: string };
    if (!post_status || !VALID_STATUSES.includes(post_status as ReviewStatus)) {
      res.status(400).json({
        message: `post_status ต้องเป็น 1 ใน: ${VALID_STATUSES.join(", ")}`,
      });
      return;
    }

    const sql = `UPDATE reviews SET post_status = $1 WHERE review_id = $2 RETURNING *;`;
    const result = await pool.query(sql, [post_status, reviewId]);

    if (result.rowCount === 0) {
      res.status(404).json({ message: `ไม่พบ review id: ${reviewId}` });
      return;
    }

    res.status(200).json({
      message: "อัปเดตสถานะ review เรียบร้อย",
      review: result.rows[0],
    });
  } catch (error) {
    console.error("Error in updateReviewStatus:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดต review" });
  }
};

/* =============================================================================
 * GET /api/reviews/total?movie=M00001
 * คืนจำนวน review + average rating ของหนังเรื่องนั้น
 * ใช้ในหน้า movie detail (sidebar / rating summary)
 * ===========================================================================*/
export const getTotalMovieReview = async (req: Request, res: Response) => {
  try {
    const movieId = pickFirst(req.query.movie);
    if (!movieId) {
      res.status(400).json({ message: 'ต้องส่ง query param "movie"' });
      return;
    }

    const sql = `
      SELECT
        COUNT(*) AS total_reviews,
        ROUND(AVG(rating), 1) AS avg_rating
      FROM reviews
      WHERE movie_id = $1 AND post_status = 'Published';
    `;
    const result = await pool.query(sql, [movieId]);

    res.status(200).json({
      movie_id: movieId,
      total_reviews: parseInt(result.rows[0].total_reviews, 10),
      avg_rating: result.rows[0].avg_rating
        ? parseFloat(result.rows[0].avg_rating)
        : null,
    });
  } catch (error) {
    console.error("Error in getTotalMovieReview:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
};

/* =============================================================================
 * DELETE /api/reviews/:reviewId
 * ===========================================================================*/
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.reviewId;
    if (!reviewId || typeof reviewId !== "string") {
      res.status(400).json({ message: "review id ไม่ถูกต้อง" });
      return;
    }

    const sql = `DELETE FROM reviews WHERE review_id = $1 RETURNING *;`;
    const result = await pool.query(sql, [reviewId]);

    if (result.rowCount === 0) {
      res.status(404).json({ message: `ไม่พบ review id: ${reviewId}` });
      return;
    }

    res.status(200).json({
      message: "ลบ review เรียบร้อย",
      review: result.rows[0],
    });
  } catch (error) {
    console.error("Error in deleteReview:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบ review" });
  }
};

// controllers/reviewController.ts
export const getReviewByMovieId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Movie ID
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5; // ตั้ง Default ไว้ที่ 5 รีวิวต่อหน้า
    const offset = (page - 1) * limit;

    // 1. Query สำหรับนับจำนวนรีวิวทั้งหมดของหนังเรื่องนี้ (เพื่อทำ Pagination)
    const countQuery = `
      SELECT COUNT(*) 
      FROM reviews 
      WHERE movie_id = $1 AND post_status = 'Published'
    `;
    const totalResult = await pool.query(countQuery, [id]);
    const totalItems = parseInt(totalResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / limit);

    // 2. Query ดึงข้อมูลรีวิวพร้อมชื่อผู้เขียน
    const dataQuery = `
      SELECT 
        r.review_id,
        r.rating,
        r.comment_text,
        r.post_time,
        u.username
      FROM reviews r
      LEFT JOIN app_user u ON r.user_id = u.user_id
      WHERE r.movie_id = $1 AND r.post_status = 'Published'
      ORDER BY r.post_time DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(dataQuery, [id, limit, offset]);

    res.status(200).json({
      data: result.rows,
      pagination: {
        total_items: totalItems,
        total_pages: totalPages,
        current_page: page,
        limit: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  }
};

// controllers/reviewController.ts
export const createReview = async (req: Request, res: Response) => {
  try {
    const { movieId, userId, rating, text } = req.body;

    const query = `
      INSERT INTO reviews (user_id, movie_id, rating, comment_text, post_status)
      VALUES ($1, $2, $3, $4, 'Published')
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, movieId, rating, text]);
    res.status(201).json({ message: "โพสต์รีวิวสำเร็จ", data: result.rows[0] });
  } catch (error: any) {
    if (error.code === "23505") {
      // 🟢 ส่งสถานะ 409 กลับไปเพื่อให้ Frontend รู้ว่าซ้ำ
      return res
        .status(409)
        .json({ message: "คุณเคยรีวิวหนังเรื่องนี้ไปแล้ว" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
