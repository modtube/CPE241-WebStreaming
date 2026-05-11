import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import movieRoutes from './routes/movieRoutes.js'; 
import crewRoutes from './routes/crewRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

<<<<<<< Updated upstream
dotenv.config();
=======
import express from "express";
import countryRoutes from "./routes/countryRoutes.js";
import personRoutes from "./routes/personRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import languageRoutes from "./routes/languageRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import cors from "cors";
import movieRoutes from "./routes/movieRoutes.js";
import crewRoutes from "./routes/crewRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userProfileRoutes from "./routes/userProfileRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js"; // 💡 1. เพิ่ม Import Transaction ตรงนี้ครับ
import path from "path";
>>>>>>> Stashed changes

const app = express();
const port = process.env.BACKEND_PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('ยินดีต้อนรับสู่ API ของ ModTube คับ! ลองไปที่ /api/movies ดูนะ');
});

<<<<<<< Updated upstream
// บอกให้ Express ใช้ movieRoutes สำหรับ URL ที่ขึ้นต้นด้วย /api/movies
app.use('/api/movies', movieRoutes);
app.use('/api/crew', crewRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/status', (req, res) => {
  res.json({ message: 'Backend is ready!' });
=======
app.use("/api/movies", movieRoutes);
app.use("/api/crew", crewRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/users", userRoutes);
app.use("/api/persons", personRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/languages", languageRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/transactions", transactionRoutes); 

// ===== User-facing routes (ไม่กระทบ API ของ admin) =====
app.use("/api/auth", authRoutes); 
app.use("/api/me", userProfileRoutes);
app.use("/api/users/:userId/playlists", playlistRoutes);
app.use("/api/cart", cartRoutes);

app.get("/api/status", (req, res) => {
  res.json({ message: "Backend is ready!" });
>>>>>>> Stashed changes
});

app.listen(port, () => {
  console.log(`📡 Server is flying on http://localhost:${port}`);
});