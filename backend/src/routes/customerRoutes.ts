import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { getMyMovies } from "../controllers/movieController.js";

const router = express.Router();

// วาง authenticateToken ไว้ตรงกลางระหว่าง Path และ Controller
// หมายความว่าใครจะเข้าถึง /my-movies ได้ ต้องผ่านการตรวจ Token ก่อนเสมอ
router.get("/my-movies", authenticateToken, getMyMovies);

export default router;
