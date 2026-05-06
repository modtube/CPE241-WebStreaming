import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Tell dotenv to go up one level to find the .env file
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;