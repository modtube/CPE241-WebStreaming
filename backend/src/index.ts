import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Routes
import movieRoutes from './routes/movieRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import personRoutes from "./routes/personRoutes.js";
import languageRoutes from "./routes/languageRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import crewRoutes from './routes/crewRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

const app = express();
const port = process.env.BACKEND_PORT || 5000;

app.use(cors());
app.use(express.json());

// Static folder สำหรับรูปที่ upload
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get("/", (req, res) => {
  res.send("ยินดีต้อนรับสู่ API ของ ModTube คับ! ลองไปที่ /api/movies ดูนะ");
});

// Mount routes
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/persons', personRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/crew', crewRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get("/api/status", (req, res) => {
  res.json({ message: "Backend is ready!" });
});

app.listen(port, () => {
  console.log(`📡 Server is flying on http://localhost:${port}`);
});
