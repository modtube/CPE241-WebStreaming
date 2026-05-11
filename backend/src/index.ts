import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";

// ===== Auth =====
import authRoutes from "./routes/authRoutes.js";

// ===== Admin Routes =====
import movieRoutes from "./routes/movieRoutes.js";
import crewRoutes from "./routes/crewRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import path from "path";
import personRoutes from "./routes/personRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import languageRoutes from "./routes/languageRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import countryRoutes from "./routes/countryRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

// ===== User-facing Routes =====

const app = express();
const port = process.env.BACKEND_PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.send("ยินดีต้อนรับสู่ API ของ ModTube คับ! ลองไปที่ /api/movies ดูนะ");
});

// ===== Auth =====
app.use("/api/auth", authRoutes);

app.use("/api/customer", customerRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/crew", crewRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/persons", personRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/languages", languageRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/transactions", transactionRoutes);

// ===== User-facing =====

app.get("/api/status", (req, res) => {
  res.json({ message: "Backend is ready!" });
});

app.listen(port, () => {
  console.log(`📡 Server is flying on http://localhost:${port}`);
});