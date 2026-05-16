import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js"; // 🟢 นำเข้า Middleware
import {
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  deleteUsers,
  getUserData,
  updateUserData,
  updatePassword,
  createUser,
  resetPassword,
} from "../controllers/userController.js";

const router = express.Router();

// GET http://localhost:5000/api/users?[...]
router.get("/", getAllUsers);

// PUT http://localhost:5000/api/users/[...]/status
/* Body:
{ "status": "suspended" }
*/
router.put("/:id/status", updateUserStatus);

// PUT http://localhost:5000/api/users/[...]/role
/* Body:
{ "role": "admin" }
*/
router.put("/:id/role", updateUserRole);

// DELETE http://localhost:5000/api/users
/* Body:
{ "userIds": ["U00001", "U00002"] }
*/
router.delete("/", deleteUsers);

router.get("/profile/:id", authenticateToken, getUserData);
router.put("/profile/:id", authenticateToken, updateUserData);
router.put("/profile/:id/password", authenticateToken, updatePassword);
router.post("/register", createUser);
router.put("/reset-password", resetPassword);

export default router;
