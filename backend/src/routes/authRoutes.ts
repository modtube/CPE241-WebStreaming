import express from "express";
import {
  checkUsername,
  login,
  register,
  changePassword,
} from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/check-username     -> เช็คว่ามี username อยู่หรือไม่
// POST /api/auth/login              -> Login (ส่งกลับข้อมูล user)
// POST /api/auth/register           -> สมัครสมาชิกใหม่
// PUT  /api/auth/:userId/password   -> เปลี่ยนรหัสผ่าน

router.post("/check-username", checkUsername);
router.post("/login", login);
router.post("/register", register);
router.put("/:userId/password", changePassword);

export default router;
