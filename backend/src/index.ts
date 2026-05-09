import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import movieRoutes from "./routes/movieRoutes.js"; // Import เข้ามาคับ
import personRoutes from "./routes/personRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import languageRoutes from "./routes/languageRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";

dotenv.config();

const app = express();
const port = process.env.BACKEND_PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ยินดีต้อนรับสู่ API ของ ModTube คับ! ลองไปที่ /api/movies ดูนะ");
});

// บอกให้ Express ใช้ movieRoutes สำหรับ URL ที่ขึ้นต้นด้วย /api/movies
app.use("/api/movies", movieRoutes);

app.use("/api/persons", personRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/languages", languageRoutes);

app.use("/api/genres", genreRoutes);

app.use("/api/ratings", ratingRoutes);

app.get("/api/status", (req, res) => {
  res.json({ message: "Backend is ready!" });
});

app.listen(port, () => {
  console.log(`📡 Server is flying on http://localhost:${port}`);
});
