import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { getMyMovies } from "../controllers/movieController.js";
import {
  getMyPlaylists,
  getPlaylistItems,
} from "../controllers/playlistController.js";

const router = express.Router();

// วาง authenticateToken ไว้ตรงกลางระหว่าง Path และ Controller
// หมายความว่าใครจะเข้าถึง /my-movies ได้ ต้องผ่านการตรวจ Token ก่อนเสมอ
router.get("/my-movies", authenticateToken, getMyMovies);

router.get("/my-playlists", authenticateToken, getMyPlaylists);

router.get("/", authenticateToken, getPlaylistItems);

export default router;
