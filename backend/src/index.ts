import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import movieRoutes from './routes/movieRoutes.js'; 
import crewRoutes from './routes/crewRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import path from 'path';

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
app.use('/api/crew', crewRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/api/status', (req, res) => {
  res.json({ message: 'Backend is ready!' });
});

app.listen(port, () => {
  console.log(`📡 Server is flying on http://localhost:${port}`);
});