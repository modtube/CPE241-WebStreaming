import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// กำหนด Interface เพื่อขยายความสามารถของ Request ให้เก็บค่า user ได้
interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  // 1. ดึง Token จาก Header "Authorization"
  const authHeader = req.headers["authorization"];

  // รูปแบบของ Header คือ "Bearer <TOKEN>" เราจึงต้อง split เอาตัวหลัง
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided" });
  }

  try {
    // 2. ตรวจสอบความถูกต้องของ Token
    // ต้องใช้ Secret Key เดียวกับตอนที่คุณสร้าง (Sign) ในไฟล์ Login
    const secretKey = process.env.JWT_SECRET || "your_fallback_secret_key";

    const decoded = jwt.verify(token, secretKey);

    // 3. ฝากข้อมูลที่ถอดรหัสแล้ว (เช่น userId, role) ไว้ในตัวแปร req.user
    // เพื่อให้ Controller ในขั้นตอนถัดไปหยิบไปใช้งานได้เลย
    req.user = decoded;

    // 4. ไปยัง Controller ตัวถัดไป
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or Expired Token" });
  }
};
