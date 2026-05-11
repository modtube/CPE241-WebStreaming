import type { Request, Response } from "express";
import pool from "../config/db.js";

/**
 * 1. ดึงรายการหนังทั้งหมด (getAllMovies)
 * รองรับระบบ Search, Filter, Pagination และ Server-side Sorting
 */
export const getAllMovies = async (req: Request, res: Response) => {
  const { genre, rating, country, search, sortBy, sortOrder } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  try {
    let filterSql = " WHERE 1=1";
    let queryParams: any[] = [];
    let counter = 1;

    // ระบบ Search (Title หรือ Movie ID)
    if (search) {
      filterSql += ` AND (m.title ILIKE $${counter} OR m.movie_id::text ILIKE $${counter})`;
      queryParams.push(`%${search}%`);
      counter++;
    }

    // ระบบ Filter ตาม Genre Name
    if (genre) {
      filterSql += ` AND m.movie_id IN (SELECT mg.movie_id FROM movie_genre mg JOIN genre g ON mg.genre_id = g.genre_id WHERE g.genre_name = $${counter})`;
      queryParams.push(genre);
      counter++;
    }

    // ระบบ Filter ตาม Rating Label
    if (rating) {
      filterSql += ` AND mr.rating_label = $${counter}`;
      queryParams.push(rating);
      counter++;
    }

    // ระบบ Filter ตาม Country Code
    if (country) {
      filterSql += ` AND m.country_code = $${counter}`;
      queryParams.push(country);
      counter++;
    }

    // ระบบ Sorting (เรียงลำดับจากข้อมูลทั้งหมดใน DB)
    let orderBySql = " ORDER BY m.movie_id ASC"; // ค่าเริ่มต้น
    if (sortBy) {
      const order = sortOrder === "descend" ? "DESC" : "ASC";
      // Map ชื่อฟิลด์จาก Frontend ให้ตรงกับคอลัมน์ในฐานข้อมูล
      const sortMap: Record<string, string> = {
        movie_id: "m.movie_id",
        title: "m.title",
        release_date: "m.release_date",
        price: "m.price",
        average_rating: "average_rating",
      };
      if (sortMap[sortBy as string]) {
        orderBySql = ` ORDER BY ${sortMap[sortBy as string]} ${order}`;
      }
    }

    // Query เพื่อนับจำนวนรายการทั้งหมดภายใต้เงื่อนไข Filter
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM movie m LEFT JOIN movie_rating mr ON m.rating_id = mr.rating_id ${filterSql}`,
      queryParams,
    );
    const totalItems = parseInt(countResult.rows[0].count);

    // Query ดึงข้อมูลหนัง
    const dataSql = `
      SELECT m.movie_id, m.title, m.release_date, m.price,
        mr.rating_label as rating,
        m.country_code as country,
        m.create_date, m.update_date,
        -- ดึง Genre Names เป็น Array
        (SELECT COALESCE(JSON_AGG(g.genre_name), '[]')
         FROM movie_genre mg 
         JOIN genre g ON mg.genre_id = g.genre_id 
         WHERE mg.movie_id = m.movie_id) as genres,
        -- คำนวณ Rating เฉลี่ย
        (SELECT COALESCE(ROUND(AVG(rv.rating), 1), 0)::float 
         FROM reviews rv 
         WHERE rv.movie_id = m.movie_id) as average_rating,
        -- นับจำนวนรีวิว
        (SELECT COUNT(*)::int 
         FROM reviews rv 
         WHERE rv.movie_id = m.movie_id) as total_reviews
      FROM movie m 
      LEFT JOIN movie_rating mr ON m.rating_id = mr.rating_id
      ${filterSql} 
      ${orderBySql}
      LIMIT $${counter} OFFSET $${counter + 1}
    `;

    const result = await pool.query(dataSql, [...queryParams, limit, offset]);

    res.status(200).json({
      data: result.rows,
      pagination: {
        total_items: totalItems,
        total_pages: Math.ceil(totalItems / limit),
        current_page: page,
        limit: limit,
      },
    });
  } catch (error) {
    console.error("Error Fetching Movies:", error);
    res.status(500).json({ message: "ไม่สามารถดึงรายการหนังได้" });
  }
};

/**
 * 2. ดึงรายละเอียดหนังรายเรื่อง (getMovieDetailById)
 * สำหรับหน้า Edit: ส่ง genre_id และ character_name กลับไปด้วย
 */
export const getMovieDetailById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const sql = `
      SELECT m.*, 
        -- ส่งกลับเป็น genre_id เพื่อให้ Checkbox ในหน้าบ้านเลือกถูกอัน
        (SELECT COALESCE(JSON_AGG(genre_id), '[]') FROM movie_genre WHERE movie_id = m.movie_id) as genres,
        -- Media Files
        (SELECT COALESCE(JSON_AGG(JSON_BUILD_OBJECT(
            'quality', mp.quality, 
            'file_path', mp.file_path, 
            'priority', mp.priority
          )), '[]') FROM media_path mp WHERE mp.movie_id = m.movie_id) as media_files,
        -- Resources (Subtitle/Audio)
        (SELECT COALESCE(JSON_AGG(JSON_BUILD_OBJECT(
            'type', mr.lang_type, 
            'file_path', mr.file_path, 
            'language_id', mr.language_id, 
            'priority', mr.priority
          )), '[]') FROM movie_resource mr WHERE mr.movie_id = m.movie_id) as resources,
        -- Cast & Crew พร้อมชื่อตัวละคร
        (SELECT COALESCE(JSON_AGG(JSON_BUILD_OBJECT(
            'person_id', p.person_id, 
            'role_type', mr_role.role_type, 
            'character_name', mr_role.character_name
          )), '[]')
         FROM movie_role mr_role 
         JOIN person p ON mr_role.person_id = p.person_id 
         WHERE mr_role.movie_id = m.movie_id) as cast_and_crew
      FROM movie m 
      WHERE m.movie_id = $1;
    `;
    const result = await pool.query(sql, [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "ไม่พบข้อมูลหนัง" });
    res.status(200).json(result.rows[0]);
  } catch (err: any) {
    console.error("Detail Error:", err);
    res.status(500).json({ message: "SQL Error", detail: err.message });
  }
};

/**
 * 3. สร้างหนังใหม่ (createMovie)
 */
export const createMovie = async (req: Request, res: Response) => {
  const client = await pool.connect();
  const movieData = req.body;
  try {
    await client.query("BEGIN");
    const movieQuery = `
      INSERT INTO movie (title, img_path, movie_description, release_date, price, rating_id, country_code) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING movie_id`;
    const movieRes = await client.query(movieQuery, [
      movieData.title,
      movieData.img_path,
      movieData.movie_description,
      movieData.release_date,
      movieData.price,
      movieData.rating_id,
      movieData.country_code,
    ]);
    const newMovieId = movieRes.rows[0].movie_id;

    if (movieData.genres) {
      for (const gid of movieData.genres) {
        await client.query(
          "INSERT INTO movie_genre (movie_id, genre_id) VALUES ($1, $2)",
          [newMovieId, gid],
        );
      }
    }
    if (movieData.media_files) {
      for (const f of movieData.media_files) {
        await client.query(
          "INSERT INTO media_path (movie_id, quality, file_path, priority) VALUES ($1, $2, $3, $4)",
          [newMovieId, f.quality, f.file_path, f.priority || 1],
        );
      }
    }
    if (movieData.resources) {
      for (const r of movieData.resources) {
        await client.query(
          "INSERT INTO movie_resource (movie_id, language_id, lang_type, file_path, priority) VALUES ($1, $2, $3, $4, $5)",
          [newMovieId, r.language_id, r.type, r.file_path, r.priority || 1],
        );
      }
    }
    if (movieData.cast_and_crew) {
      for (const p of movieData.cast_and_crew) {
        await client.query(
          "INSERT INTO movie_role (movie_id, person_id, role_type, character_name) VALUES ($1, $2, $3, $4)",
          [newMovieId, p.person_id, p.role_type, p.character_name],
        );
      }
    }

    await client.query("COMMIT");
    res.status(201).json({ message: "สร้างหนังสำเร็จ", movie_id: newMovieId });
  } catch (error: any) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: "บันทึกล้มเหลว", debug: error.message });
  } finally {
    client.release();
  }
};

/**
 * 4. อัปเดตหนัง (updateMovie)
 */
export const updateMovie = async (req: Request, res: Response) => {
  const { id } = req.params;
  const movieData = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `UPDATE movie SET title=$1, img_path=$2, movie_description=$3, release_date=$4, price=$5, rating_id=$6, country_code=$7, update_date=CURRENT_TIMESTAMP WHERE movie_id=$8`,
      [
        movieData.title,
        movieData.img_path,
        movieData.movie_description,
        movieData.release_date,
        movieData.price,
        movieData.rating_id,
        movieData.country_code,
        id,
      ],
    );

    // ล้างข้อมูลความสัมพันธ์เก่า
    await client.query("DELETE FROM movie_genre WHERE movie_id=$1", [id]);
    await client.query("DELETE FROM media_path WHERE movie_id=$1", [id]);
    await client.query("DELETE FROM movie_resource WHERE movie_id=$1", [id]);
    await client.query("DELETE FROM movie_role WHERE movie_id=$1", [id]);

    // บันทึกข้อมูลใหม่
    if (movieData.genres) {
      for (const gid of movieData.genres)
        await client.query(
          "INSERT INTO movie_genre (movie_id, genre_id) VALUES ($1, $2)",
          [id, gid],
        );
    }
    if (movieData.media_files) {
      for (const f of movieData.media_files)
        await client.query(
          "INSERT INTO media_path (movie_id, quality, file_path, priority) VALUES ($1, $2, $3, $4)",
          [id, f.quality, f.file_path, f.priority || 1],
        );
    }
    if (movieData.resources) {
      for (const r of movieData.resources)
        await client.query(
          "INSERT INTO movie_resource (movie_id, language_id, lang_type, file_path, priority) VALUES ($1, $2, $3, $4, $5)",
          [id, r.language_id, r.type, r.file_path, r.priority || 1],
        );
    }
    if (movieData.cast_and_crew) {
      for (const p of movieData.cast_and_crew)
        await client.query(
          "INSERT INTO movie_role (movie_id, person_id, role_type, character_name) VALUES ($1, $2, $3, $4)",
          [id, p.person_id, p.role_type, p.character_name],
        );
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "อัปเดตสำเร็จ" });
  } catch (error: any) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: "อัปเดตล้มเหลว", debug: error.message });
  } finally {
    client.release();
  }
};

/**
 * 5. ลบหนัง (deleteMovieById)
 */
export const deleteMovieById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // การลบข้อมูลลูกจะถูกจัดการโดย ON DELETE CASCADE ใน Database Schema
    await pool.query("DELETE FROM movie WHERE movie_id = $1", [id]);
    res.status(200).json({ message: "ลบสำเร็จ" });
  } catch (error: any) {
    res.status(500).json({ message: "ลบล้มเหลว", debug: error.message });
  }
};

export const getMyMovies = async (req: any, res: Response) => {
  try {
    // ดึง userId ออกมาจาก req.user (ที่ฝากมาจาก middleware)
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT 
    m.movie_id, 
    m.title, 
    m.img_path,
    p.purchase_date
FROM personal_library p
JOIN movie m ON p.movie_id = m.movie_id
WHERE p.user_id = $1
ORDER BY p.purchase_date DESC;`,
      [userId],
    );

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error}` });
  }
};
