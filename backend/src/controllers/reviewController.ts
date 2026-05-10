import type { Request, Response } from 'express';
import pool from '../config/db.js'; // ต้องมี .js เพราะเราใช้ ESM คับ

/**
 * ค่าที่ post_status ในตาราง reviews อนุญาต (ตาม CHECK constraint ใน 01_schema.sql)
 * หมายเหตุ: Frontend Figma ใช้คำว่า Active/Suspended/Banned ซึ่งไม่ตรงกับ schema
 *          ค่าพวกนั้นเป็นของ user_status (ตาราง app_user) ไม่ใช่ของ review
 *          คนทำ Frontend ต้องเปลี่ยน label เป็น Published/Hidden/Removed นะ
 */
const VALID_STATUSES = ['Published', 'Hidden', 'Removed'] as const;
type ReviewStatus = (typeof VALID_STATUSES)[number];

const FILTERABLE_COLUMNS = ['post_status', 'user_id', 'movie_id', 'rating'] as const;
const NUMERIC_FILTER_COLUMNS = new Set(['user_id', 'movie_id', 'rating']);

/* =============================================================================
 * ID FORMAT HELPERS
 * -----------------------------------------------------------------------------
 * Database เก็บ id เป็น INT (เช่น 1, 2, 23) แต่ตามที่ทีมตกลง display จะเป็น
 *   review_id  10 → "V00010"   (V = reView)
 *   user_id    5  → "U00005"
 *   movie_id   23 → "M00023"
 *
 * - Output: ทุก response แปลงเป็น string มี prefix + zero-pad 5 หลัก
 * - Input:  รับได้ทั้ง "V00010" หรือ "10" (parser ตัด prefix ทิ้งให้)
 * - DB:     ไม่ต้องแก้ schema เลย ยังเป็น INT เหมือนเดิม
 * ===========================================================================*/
const ID_PREFIX = {
  review: 'V',
  user: 'U',
  movie: 'M',
} as const;
const ID_PAD_LENGTH = 5;

function formatId(prefix: string, id: number | null | undefined): string | null {
  if (id === null || id === undefined) return null;
  return `${prefix}${String(id).padStart(ID_PAD_LENGTH, '0')}`;
}

/** รับได้ทั้ง "V00010", "v00010", "00010", "10", หรือ 10 — คืน 10. ผิด format → null */
function parseId(input: string | number | undefined | null): number | null {
  if (input === null || input === undefined || input === '') return null;
  if (typeof input === 'number') return Number.isFinite(input) ? input : null;
  const numericPart = String(input).replace(/^[A-Za-z]+/, '');
  const parsed = parseInt(numericPart, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

/** แปลง row จาก DB ให้ id ทุกตัวเป็น string format */
function formatRow(row: Record<string, unknown>) {
  return {
    ...row,
    review_id: formatId(ID_PREFIX.review, row.review_id as number | null),
    user_id: formatId(ID_PREFIX.user, row.user_id as number | null),
    movie_id: formatId(ID_PREFIX.movie, row.movie_id as number | null),
  };
}

/* =============================================================================
 * GET /api/reviews
 * Query params:
 *   - post_status, user_id, movie_id, rating  (filter; user_id/movie_id รับ "U00001" หรือ "1" ก็ได้)
 *   - search       (ค้นใน comment_text)
 *   - search_id    (ค้นจาก review_id / user_id / movie_id เช่น "V00001", "U00", "M0002")
 *   - page         (default 1)
 *   - limit        (default 20, max 100)
 * Response:
 *   { data: [...], total: 120, page: 1, limit: 20, total_pages: 6 }
 *   format นี้ตอบโจทย์ "Showing 1 to 20 of 120 results" ในหน้า Figma ได้เลย
 * ===========================================================================*/
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const conditions: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    // ----- Filter: whitelist columns เพื่อกัน SQL injection -----
    for (const col of FILTERABLE_COLUMNS) {
      const raw = req.query[col];
      if (raw === undefined) continue;
      let value: string | number | null = Array.isArray(raw) ? String(raw[0] ?? '') : String(raw);

      // ถ้าเป็น column ที่เก็บเป็นเลข ให้ parse "U00005" → 5 ก่อน
      if (NUMERIC_FILTER_COLUMNS.has(col)) {
        value = parseId(value);
        if (value === null) continue; // ค่าไม่ถูก ข้ามไปไม่ filter
      }
      conditions.push(`r.${col} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }

    // ----- Search keyword ใน comment_text (case-insensitive) -----
    if (req.query.search) {
      const v = Array.isArray(req.query.search) ? String(req.query.search[0]) : String(req.query.search);
      conditions.push(`r.comment_text ILIKE $${paramIndex}`);
      values.push(`%${v}%`);
      paramIndex++;
    }

    // ----- Search by formatted ID -----
    // รองรับการพิมพ์ "V00001", "U00005", "M00023" หรือพิมพ์บางส่วน เช่น "V0001", "U00"
    // SQL: cast id เป็น string มี prefix แล้วเทียบด้วย ILIKE
    // (NULL user_id ปลอดภัย: 'U' || LPAD(NULL,5,'0') = NULL, NULL ILIKE ... = false)
    if (req.query.search_id) {
      const v = Array.isArray(req.query.search_id) ? String(req.query.search_id[0]) : String(req.query.search_id);
      conditions.push(`(
        ('${ID_PREFIX.review}' || LPAD(r.review_id::text, ${ID_PAD_LENGTH}, '0')) ILIKE $${paramIndex}
        OR ('${ID_PREFIX.user}'  || LPAD(r.user_id::text,  ${ID_PAD_LENGTH}, '0')) ILIKE $${paramIndex}
        OR ('${ID_PREFIX.movie}' || LPAD(r.movie_id::text, ${ID_PAD_LENGTH}, '0')) ILIKE $${paramIndex}
      )`);
      values.push(`%${v}%`);
      paramIndex++;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    // ----- Pagination -----
    const limitRaw = parseInt(String(req.query.limit ?? ''), 10);
    const limit = Number.isFinite(limitRaw) && limitRaw > 0 && limitRaw <= 100 ? limitRaw : 20;
    const pageRaw = parseInt(String(req.query.page ?? ''), 10);
    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
    const offset = (page - 1) * limit;

    /* =========================================================================
     * [SORT — DISABLED] Frontend จะจัดเรียงเอง
     * -------------------------------------------------------------------------
     * ถ้าวันไหนทีมต้องการให้ backend จัดเรียงเอง ให้เปิด comment ด้านล่างนี้
     * แล้วเปลี่ยน const orderClause ตรงท้าย block นี้ให้ใช้ตัวที่สร้างจาก param
     *
     * วิธีใช้ฝั่ง frontend (ตัวอย่าง):
     *   /api/reviews?sort_by=rating&sort_order=desc
     *   /api/reviews?sort_by=post_time&sort_order=asc
     *
     * --- code เริ่ม ---
     * const ALLOWED_SORT_COLUMNS = ['review_id', 'rating', 'post_time', 'post_status'] as const;
     * const sortByRaw = req.query.sort_by as string | undefined;
     * const sortBy = ALLOWED_SORT_COLUMNS.includes(sortByRaw as (typeof ALLOWED_SORT_COLUMNS)[number])
     *   ? sortByRaw
     *   : 'post_time';
     * const sortOrder = req.query.sort_order === 'asc' ? 'ASC' : 'DESC';
     * const orderClause = `ORDER BY r.${sortBy} ${sortOrder}`;
     * --- code จบ ---
     *
     * !! WARNING !!
     * pg ไม่อนุญาตให้ใช้ ORDER BY $1 (parameterized) เพราะ identifier ไม่ใช่ value
     * ต้อง concat เป็น string ตรงๆ — ถ้า concat ค่าจาก user โดยไม่ผ่าน whitelist
     * (ALLOWED_SORT_COLUMNS) จะเปิดช่อง SQL injection เลยทันที ห้ามลืม!
     * =========================================================================*/
    const orderClause = 'ORDER BY r.post_time DESC'; // default order ปัจจุบัน

    // Query 1: นับจำนวนทั้งหมด (สำหรับ "Showing X to Y of Z")
    const countSql = `
      SELECT COUNT(*) AS total
      FROM reviews r
      LEFT JOIN app_user u ON r.user_id = u.user_id
      LEFT JOIN movie m ON r.movie_id = m.movie_id
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
      data: dataResult.rows.map(formatRow),
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error in getAllReviews:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล reviews' });
  }
};

/* =============================================================================
 * PATCH /api/reviews/:reviewId/status
 * รับ :reviewId เป็น "V00001" หรือ "1" ก็ได้
 * Body: { "post_status": "Published" | "Hidden" | "Removed" }
 * ===========================================================================*/
export const updateReviewStatus = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.reviewId;
    const reviewId = parseId(Array.isArray(rawId) ? rawId[0] : rawId);
    if (reviewId === null) {
      res.status(400).json({ message: 'review id ไม่ถูกต้อง' });
      return;
    }

    const { post_status } = req.body as { post_status?: string };
    if (!post_status || !VALID_STATUSES.includes(post_status as ReviewStatus)) {
      res.status(400).json({
        message: `post_status ต้องเป็น 1 ใน: ${VALID_STATUSES.join(', ')}`,
      });
      return;
    }

    const sql = `UPDATE reviews SET post_status = $1 WHERE review_id = $2 RETURNING *;`;
    const result = await pool.query(sql, [post_status, reviewId]);

    if (result.rowCount === 0) {
      res.status(404).json({
        message: `ไม่พบ review id: ${formatId(ID_PREFIX.review, reviewId)}`,
      });
      return;
    }

    res.status(200).json({
      message: 'อัปเดตสถานะ review เรียบร้อย',
      review: formatRow(result.rows[0]),
    });
  } catch (error) {
    console.error('Error in updateReviewStatus:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดต review' });
  }
};

/* =============================================================================
 * DELETE /api/reviews/:reviewId
 * รับ :reviewId เป็น "V00001" หรือ "1" ก็ได้
 * ===========================================================================*/
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.reviewId;
    const reviewId = parseId(Array.isArray(rawId) ? rawId[0] : rawId);
    if (reviewId === null) {
      res.status(400).json({ message: 'review id ไม่ถูกต้อง' });
      return;
    }

    const sql = `DELETE FROM reviews WHERE review_id = $1 RETURNING *;`;
    const result = await pool.query(sql, [reviewId]);

    if (result.rowCount === 0) {
      res.status(404).json({
        message: `ไม่พบ review id: ${formatId(ID_PREFIX.review, reviewId)}`,
      });
      return;
    }

    res.status(200).json({
      message: 'ลบ review เรียบร้อย',
      review: formatRow(result.rows[0]),
    });
  } catch (error) {
    console.error('Error in deleteReview:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบ review' });
  }
};
