import express from "express";
import {
  getMyPlaylists,
  getPlaylistItems,
  createPlaylist,
  addPlaylistItem,
  deletePlaylistItem,
  deletePlaylist,
} from "../controllers/playlistController.js";

const router = express.Router({ mergeParams: true });

// mounted at /api/users/:userId/playlists
// GET    /              -> playlists ของ user
// POST   /              -> create playlist
// DELETE /:playlistName -> delete playlist
// GET    /:playlistName/items                  -> items + movie info
// POST   /:playlistName/items                  -> add movie to playlist
// DELETE /:playlistName/items/:movieId         -> remove item

router.get("/", getMyPlaylists);
router.post("/", createPlaylist);
router.delete("/:playlistName", deletePlaylist);
router.get("/:playlistName/items", getPlaylistItems);
router.post("/:playlistName/items", addPlaylistItem);
router.delete("/:playlistName/items/:movieId", deletePlaylistItem);

export default router;
