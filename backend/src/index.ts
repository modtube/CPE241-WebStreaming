import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import movieRoutes from './routes/movieRoutes.js'; // Import เข้ามาคับ
import reviewRoutes from './routes/reviewRoutes.js';

dotenv.config();

const app = express();
const port = process.env.BACKEND_PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('ยินดีต้อนรับสู่ API ของ ModTube คับ! ลองไปที่ /api/movies ดูนะ');
});

// บอกให้ Express ใช้ movieRoutes สำหรับ URL ที่ขึ้นต้นด้วย /api/movies
app.use('/api/movies', movieRoutes);
// บอกให้ Express ใช้ reviewRoutes สำหรับ URL ที่ขึ้นต้นด้วย /api/reviews
app.use('/api/reviews', reviewRoutes);

app.get('/api/status', (req, res) => {
  res.json({ message: 'Backend is ready!' });
});

app.listen(port, () => {
  console.log(`📡 Server is flying on http://localhost:${port}`);
});