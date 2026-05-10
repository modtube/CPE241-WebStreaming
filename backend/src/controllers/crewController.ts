import type { Request, Response } from 'express';
import pool from '../config/db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/crew';
    // สร้างโฟลเดอร์อัตโนมัติถ้ายังไม่มี
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // ตั้งชื่อไฟล์ใหม่: person-timestamp.extension (ป้องกันชื่อซ้ำ)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'person-' + uniqueSuffix + path.extname(file.originalname));
  }
});

/**
 * Fetch all crew and cast members.
 * Ordered by ID in descending order (newest first).
 */
export const getAllCrew = async (req: Request, res: Response) => {
  // 1. รับค่า search จาก Query Parameters (เช่น ?search=abc)
  const { search } = req.query;

  try {
    let result;
    
    if (search) {
      // 2. ถ้ามีการค้นหา ให้ใช้ ILIKE (Case-insensitive LIKE) ค้นหาจากชื่อ-นามสกุล
      // %${search}% หมายถึงมีคำนั้นอยู่ตรงไหนก็ได้
      const searchQuery = `
        SELECT * FROM person 
        WHERE person_id ILIKE $1
           OR first_name ILIKE $1 
           OR middle_name ILIKE $1 
           OR last_name ILIKE $1 
        ORDER BY person_id DESC
      `;
      result = await pool.query(searchQuery, [`%${search}%`]);
    } else {
      // 3. ถ้าไม่มีการค้นหา ให้ดึงทั้งหมดเหมือนเดิม
      result = await pool.query('SELECT * FROM person ORDER BY person_id DESC');
    }
    
    res.status(200).json({ data: result.rows });
  } catch (error: any) {
    console.error('Database Error:', error.message);
    res.status(500).json({ message: 'An error occurred while fetching crew data.' });
  }
};

/**
 * Fetch a single crew member by ID.
 * Supports string-based IDs like 'P00001'.
 */
export const getPersonById = async (req: Request, res: Response) => {
  const { id } = req.params; // Get 'P00001' from URL parameters.

  try {
    // Search using the string ID directly; no parsing needed.
    const result = await pool.query(
      "SELECT * FROM person WHERE person_id = $1", 
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Specified crew member not found." });
    }

    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error('Fetch Person Error:', error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const upload = multer({ storage: storage });
/**
 * Create a new crew member.
 */
export const createPerson = async (req: Request, res: Response) => {
  const { first_name, middle_name, last_name, birth_date, birth_place, nationality, biography } = req.body;
  
  // เก็บ Path ของไฟล์ที่อยู่ในเครื่องเรา (เช่น uploads/crew/person-123.jpg)
  const img_path = req.file ? `/${req.file.path.replace(/\\/g, '/')}` : null;

  try {
    const result = await pool.query(
      `INSERT INTO person 
       (first_name, middle_name, last_name, birth_date, birth_place, nationality, biography, img_path) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [first_name, middle_name || null, last_name, birth_date, birth_place, nationality, biography || null, img_path]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Update an existing crew member by ID.
 */
export const updatePerson = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { 
    first_name, 
    middle_name, 
    last_name, 
    birth_date, 
    birth_place, 
    nationality, 
    biography,
    img_path
  } = req.body;

  try {
    // Check if person exists
    const checkResult = await pool.query(
      "SELECT * FROM person WHERE person_id = $1",
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Crew member not found." });
    }

    // Update the person
    const result = await pool.query(
      `UPDATE person 
       SET first_name = COALESCE($2, first_name),
           middle_name = COALESCE($3, middle_name),
           last_name = COALESCE($4, last_name),
           birth_date = COALESCE($5, birth_date),
           birth_place = COALESCE($6, birth_place),
           nationality = COALESCE($7, nationality),
           biography = COALESCE($8, biography),
           img_path = COALESCE($9, img_path),
           update_date = CURRENT_TIMESTAMP
       WHERE person_id = $1 
       RETURNING *`,
      [id, first_name, middle_name, last_name, birth_date, birth_place, nationality, biography, img_path]
    );

    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error('Update Person Error:', error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deletePerson = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // ตรวจสอบก่อนว่ามีข้อมูลนี้อยู่จริงไหม
    const checkResult = await pool.query("SELECT * FROM person WHERE person_id = $1", [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Crew member not found." });
    }

    // ทำการลบข้อมูล
    await pool.query("DELETE FROM person WHERE person_id = $1", [id]);

    res.status(200).json({ message: "Crew member deleted successfully." });
  } catch (error: any) {
    console.error('Delete Person Error:', error.message);
    // กรณีลบไม่ได้เพราะติด Foreign Key (เช่น มีชื่อไปปรากฏใน movie_role)
    if (error.code === '23503') {
      return res.status(400).json({ message: "Cannot delete: This person is still linked to movie roles." });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

