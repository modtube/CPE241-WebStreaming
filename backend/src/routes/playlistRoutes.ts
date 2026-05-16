import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  getPlaylistItems,
  createPlaylist,
  deletePlaylist,
  addMovieToPlaylist,
  deleteMovieFromPlaylist,
} from "../controllers/playlistController.js";

const router = express.Router();

/**
 * @route   GET /api/playlist
 * @desc    ดึงรายการหนังภายในเพลย์ลิสต์ (ใช้ playlist_name จาก Query String)
 * @access  Private (ต้องมี Token)
 */
router.get("/", authenticateToken, getPlaylistItems);

router.post("/create", authenticateToken, createPlaylist);

router.delete("/delete", authenticateToken, deletePlaylist);

router.post("/add-movie", authenticateToken, addMovieToPlaylist);

router.delete("/remove-movie", authenticateToken, deleteMovieFromPlaylist);

// หมายเหตุ: คุณสามารถเพิ่ม Route สำหรับ Create, Delete หรือ Update ได้ที่นี่ในอนาคต
// router.post("/", authenticateToken, createPlaylist);
// router.delete("/", authenticateToken, deletePlaylist);

export default router;
