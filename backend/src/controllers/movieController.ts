import type { Request, Response } from "express";
import pool from "../config/db.js"; // ต้องมี .js เพราะเราใช้ ESM คับ

export const getAllMovies = async (req: Request, res: Response) => {
  // 1. รับค่าจาก Query Params ทั้งหมด
  const { genre, rating, country, search } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  try {
    // เตรียมเงื่อนไขการ Filter (ใช้ m. เพื่อระบุว่าเป็นตาราง movie หลัก)
    let filterSql = " WHERE 1=1";
    let queryParams: any[] = [];
    let counter = 1;

    // A. ระบบ Search จากชื่อหนัง (เพิ่มตามที่คุณต้องการ)
    if (search) {
      filterSql += ` AND m.title ILIKE $${counter}`;
      queryParams.push(`%${search}%`);
      counter++;
    }

    // B. ระบบ Filter ตาม Genre
    if (genre) {
      filterSql += ` AND m.movie_id IN (SELECT movie_id FROM movie_genre WHERE genre_id = $${counter})`;
      queryParams.push(genre);
      counter++;
    }

    // C. ระบบ Filter ตาม Rating
    if (rating) {
      filterSql += ` AND m.rating_id = $${counter}`;
      queryParams.push(rating);
      counter++;
    }

    // D. ระบบ Filter ตาม Country
    if (country) {
      filterSql += ` AND m.country_code = $${counter}`;
      queryParams.push(country);
      counter++;
    }

    // 2. Query เพื่อนับจำนวนรายการทั้งหมด (Total Count) ภายใต้เงื่อนไข Filter นี้
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM movie m ${filterSql}`,
      queryParams,
    );
    const totalItems = parseInt(countResult.rows[0].count);

    // 3. Query หลัก: ดึงข้อมูลหนัง + Genres Array + Review Stats
    const dataSql = `
      SELECT m.title, m.img_path, m.release_date, -- ดึงตามที่จะใช้ใน front ของ movie view (ภาพ, ชื่อ, ปีที่ฉาย)
        -- ดึง Genre ของหนังแต่ละเรื่องออกมาเป็น Array
        (SELECT COALESCE(JSON_AGG(g.genre_name), '[]')
         FROM movie_genre mg 
         JOIN genre g ON mg.genre_id = g.genre_id 
         WHERE mg.movie_id = m.movie_id) as genres,
        
        -- คำนวณค่าเฉลี่ยรีวิว (ทศนิยม 1 ตำแหน่ง)
        (SELECT COALESCE(ROUND(AVG(rv.rating), 1), 0)::float 
         FROM reviews rv 
         WHERE rv.movie_id = m.movie_id) as average_rating,
        
        -- นับจำนวนรีวิวทั้งหมด
        (SELECT COUNT(*)::int 
         FROM reviews rv 
         WHERE rv.movie_id = m.movie_id) as total_reviews

      FROM movie m 
      ${filterSql} 
      ORDER BY m.movie_id ASC
      LIMIT $${counter} OFFSET $${counter + 1}
    `;

    // ส่งค่า limit และ offset ต่อท้ายพารามิเตอร์การ Filter
    const result = await pool.query(dataSql, [...queryParams, limit, offset]);

    // 4. ตอบกลับด้วยโครงสร้างข้อมูลที่ Frontend ใช้งานง่าย
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
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลหนัง" });
  }
};

export const getMovieDetailById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const sql = `
      SELECT m.*, 
        -- 1. ดึงข้อมูล Genres (Array ของ String)
        (SELECT COALESCE(JSON_AGG(g.genre_name), '[]')
         FROM movie_genre mg 
         JOIN genre g ON mg.genre_id = g.genre_id 
         WHERE mg.movie_id = m.movie_id) as genres,

        -- 2. ดึงข้อมูล Media Paths (Array ของ Objects: quality, path)
        (SELECT COALESCE(JSON_AGG(JSON_BUILD_OBJECT(
            'quality', mp.quality, 
            'file_path', mp.file_path,
            'priority', mp.priority
          )), '[]')
         FROM media_path mp 
         WHERE mp.movie_id = m.movie_id) as media_files,

        -- 3. ดึงข้อมูล Resources (Audio/Subtitle พร้อมชื่อภาษา)
        (SELECT COALESCE(JSON_AGG(JSON_BUILD_OBJECT(
            'type', mr.lang_type, 
            'file_path', mr.file_path,
            'language', l.language_name,
            'priority', mr.priority
          )), '[]')
         FROM movie_resource mr
         JOIN language_list l ON mr.language_id = l.language_id
         WHERE mr.movie_id = m.movie_id) as resources,

        -- 4. ดึงข้อมูลนักแสดงและทีมงาน (Crews)
        (SELECT COALESCE(JSON_AGG(JSON_BUILD_OBJECT(
            'person_id', p.person_id,
            'name', p.first_name || ' ' || COALESCE(p.middle_name || ' ', '') || p.last_name,
            'role', mr_role.role_type,
            'img_path', p.img_path,
            'nationality', p.nationality
          )), '[]')
         FROM movie_role mr_role
         JOIN person p ON mr_role.person_id = p.person_id
         WHERE mr_role.movie_id = m.movie_id) as cast_and_crew,

        -- 5. สถิติรีวิว (ค่าเฉลี่ยและจำนวน)
        (SELECT COALESCE(ROUND(AVG(rv.rating), 1), 0)::float FROM reviews rv WHERE rv.movie_id = m.movie_id) as average_rating,
        (SELECT COUNT(*)::int FROM reviews rv WHERE rv.movie_id = m.movie_id) as total_reviews

      FROM movie m
      WHERE m.movie_id = $1;
    `;

    const result = await pool.query(sql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลหนังเรื่องนี้" });
    }

    res.status(200).json(result.rows[0]); // ส่งกลับเป็น Object เดียว
  } catch (err: any) {
    console.error("Error Fetching Movie Details:", err);
    res.status(500).json({
      message: "พบจุดผิดพลาดใน SQL",
      error_detail: err.message, // มันจะบอกว่า 'table "..." does not exist' หรืออะไรสักอย่าง
      error_code: err.code,
    });
  }
};

export const deleteMovieById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // ยิงคำสั่ง DELETE ไปที่ตาราง movie หลัก
    const result = await pool.query("DELETE FROM movie WHERE movie_id = $1", [
      id,
    ]);

    // ตรวจสอบว่ามีหนัง ID นี้ให้ลบจริงหรือไม่
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: `ไม่พบหนัง ID: ${id} สำหรับการลบ` });
    }

    res.status(200).json({ message: `ลบหนัง ID: ${id} เรียบร้อยแล้ว` });
  } catch (error: any) {
    console.error("Error Deleting Movie:", error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดในการลบหนัง",
      debug: error.message,
    });
  }
};

export const createMovie = async (req: Request, res: Response) => {
  const client = await pool.connect();
  const movieData = req.body;

  try {
    await client.query("BEGIN"); // เริ่ม Transaction

    // 1. Insert ลงตาราง movie หลัก
    const movieQuery = `
      INSERT INTO movie (title, img_path, movie_description, release_date, price, rating_id, country_code)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING movie_id
    `;
    const movieValues = [
      movieData.title,
      movieData.img_path,
      movieData.movie_description,
      movieData.release_date,
      movieData.price,
      movieData.rating_id,
      movieData.country_code,
    ];
    const movieRes = await client.query(movieQuery, movieValues);
    const newMovieId = movieRes.rows[0].movie_id;

    // 2. Insert Genres (รับมาเป็น Array ของ ID ตรงๆ)
    if (movieData.genres && movieData.genres.length > 0) {
      for (const genreId of movieData.genres) {
        await client.query(
          "INSERT INTO movie_genre (movie_id, genre_id) VALUES ($1, $2)",
          [newMovieId, genreId],
        );
      }
    }

    // 3. Insert Media Paths
    if (movieData.media_files && movieData.media_files.length > 0) {
      for (const file of movieData.media_files) {
        await client.query(
          "INSERT INTO media_path (movie_id, quality, file_path, priority) VALUES ($1, $2, $3, $4)",
          [newMovieId, file.quality, file.file_path, file.priority || 1],
        );
      }
    }

    // 4. Insert Resources (ใช้ language_id ตรงๆ)
    if (movieData.resources && movieData.resources.length > 0) {
      for (const resItem of movieData.resources) {
        await client.query(
          "INSERT INTO movie_resource (movie_id, language_id, lang_type, file_path, priority) VALUES ($1, $2, $3, $4, $5)",
          [
            newMovieId,
            resItem.language_id,
            resItem.type,
            resItem.file_path,
            resItem.priority || 1,
          ],
        );
      }
    }

    // 5. Insert Cast and Crew (ใช้ role_type ตาม Schema)
    if (movieData.cast_and_crew && movieData.cast_and_crew.length > 0) {
      for (const person of movieData.cast_and_crew) {
        await client.query(
          "INSERT INTO movie_role (movie_id, person_id, role_type) VALUES ($1, $2, $3)",
          [newMovieId, person.person_id, person.role_type],
        );
      }
    }

    await client.query("COMMIT"); // ยืนยันการบันทึกทั้งหมด
    res
      .status(201)
      .json({ message: "สร้างหนังใหม่สำเร็จ", movie_id: newMovieId });
  } catch (error: any) {
    await client.query("ROLLBACK"); // ยกเลิกทั้งหมดหากพังที่จุดใดจุดหนึ่ง
    console.error("Error creating movie:", error);
    res.status(500).json({
      message: "ไม่สามารถสร้างหนังได้",
      debug: error.message,
    });
  } finally {
    client.release();
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  const { id } = req.params; // รับ movie_id จาก URL
  const movieData = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Update ข้อมูลหลักในตาราง movie
    const updateMovieQuery = `
      UPDATE movie 
      SET title = $1, img_path = $2, movie_description = $3, 
          release_date = $4, price = $5, rating_id = $6, 
          country_code = $7, update_date = CURRENT_TIMESTAMP
      WHERE movie_id = $8
    `;
    const updateMovieValues = [
      movieData.title,
      movieData.img_path,
      movieData.movie_description,
      movieData.release_date,
      movieData.price,
      movieData.rating_id,
      movieData.country_code,
      id,
    ];
    const updateRes = await client.query(updateMovieQuery, updateMovieValues);

    if (updateRes.rowCount === 0) {
      throw new Error("ไม่พบหนังที่ต้องการอัปเดต");
    }

    // 2. ลบข้อมูลความสัมพันธ์เก่าทั้งหมด (Clear)
    await client.query("DELETE FROM movie_genre WHERE movie_id = $1", [id]);
    await client.query("DELETE FROM media_path WHERE movie_id = $1", [id]);
    await client.query("DELETE FROM movie_resource WHERE movie_id = $1", [id]);
    await client.query("DELETE FROM movie_role WHERE movie_id = $1", [id]);

    // 3. เริ่มบันทึกข้อมูลใหม่ (Sync)

    // Genres
    if (movieData.genres && movieData.genres.length > 0) {
      for (const genreId of movieData.genres) {
        await client.query(
          "INSERT INTO movie_genre (movie_id, genre_id) VALUES ($1, $2)",
          [id, genreId],
        );
      }
    }

    // Media Files
    if (movieData.media_files && movieData.media_files.length > 0) {
      for (const file of movieData.media_files) {
        await client.query(
          "INSERT INTO media_path (movie_id, quality, file_path, priority) VALUES ($1, $2, $3, $4)",
          [id, file.quality, file.file_path, file.priority || 1],
        );
      }
    }

    // Resources (Sub/Audio)
    if (movieData.resources && movieData.resources.length > 0) {
      for (const resItem of movieData.resources) {
        await client.query(
          "INSERT INTO movie_resource (movie_id, language_id, lang_type, file_path, priority) VALUES ($1, $2, $3, $4, $5)",
          [
            id,
            resItem.language_id,
            resItem.type,
            resItem.file_path,
            resItem.priority || 1,
          ],
        );
      }
    }

    // Cast and Crew
    if (movieData.cast_and_crew && movieData.cast_and_crew.length > 0) {
      for (const person of movieData.cast_and_crew) {
        await client.query(
          "INSERT INTO movie_role (movie_id, person_id, role_type) VALUES ($1, $2, $3)",
          [id, person.person_id, person.role_type],
        );
      }
    }

    await client.query("COMMIT");
    res.status(200).json({ message: `อัปเดตหนัง ID: ${id} สำเร็จ` });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Update Movie Error:", error);
    res
      .status(500)
      .json({ message: "ไม่สามารถอัปเดตหนังได้", debug: error.message });
  } finally {
    client.release();
  }
};
