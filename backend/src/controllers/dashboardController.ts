// controllers/dashboardController.ts
import type { Request, Response } from "express";
import pool from "../config/db.js";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // 1. Quick Stats
    const quickStatsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM movie) as total_movies,
        (SELECT COUNT(*) FROM app_user) as total_users,
        (SELECT SUM(total_amount) FROM transaction_list) as total_revenue,
        (SELECT AVG(rating) FROM reviews) as avg_rating
    `;

    // 2. Revenue Trend: เพิ่มปีเข้าไปในชื่อเดือนเพื่อแยกข้อมูลแต่ละปี
    const revenueTrendQuery = `
      SELECT 
        TO_CHAR(transaction_date, 'Mon YYYY') as month,
        SUM(total_amount) as amount
      FROM transaction_list
      GROUP BY DATE_TRUNC('month', transaction_date), TO_CHAR(transaction_date, 'Mon YYYY')
      ORDER BY DATE_TRUNC('month', transaction_date)
      LIMIT 12
    `;

    // 3. Top 5 Best Sellers
    const topSellersQuery = `
      SELECT 
        m.movie_id as id,
        m.title,
        COUNT(td.detail_id) as units_sold,
        SUM(td.sold_price) as total
      FROM transaction_detail td
      JOIN movie m ON td.movie_id = m.movie_id
      GROUP BY m.movie_id, m.title
      ORDER BY total DESC
      LIMIT 5
    `;

    // 4. Movie by Genre
    const genreDistributionQuery = `
      SELECT 
        g.genre_name as name,
        COUNT(mg.movie_id) as value
      FROM movie_genre mg
      JOIN genre g ON mg.genre_id = g.genre_id
      GROUP BY g.genre_name
    `;

    // 5. User Growth (Cumulative): ใช้ Window Function คำนวณยอดสะสม

    const userGrowthQuery = `
      SELECT 
        TO_CHAR(register_date, 'Mon YYYY') as month,
        SUM(COUNT(user_id)) OVER (ORDER BY DATE_TRUNC('month', register_date)) as count
      FROM app_user
      GROUP BY DATE_TRUNC('month', register_date), TO_CHAR(register_date, 'Mon YYYY')
      ORDER BY DATE_TRUNC('month', register_date)
    `;

    // 6. User Distribution by Country
    const countryDistQuery = `
      SELECT 
        c.country_name as name,
        COUNT(u.user_id) as value
      FROM app_user u
      JOIN country c ON u.country_code = c.country_code
      GROUP BY c.country_name
    `;

    const [
      quickStats,
      revenueTrend,
      topSellers,
      genres,
      userGrowth,
      countries,
    ] = await Promise.all([
      pool.query(quickStatsQuery),
      pool.query(revenueTrendQuery),
      pool.query(topSellersQuery),
      pool.query(genreDistributionQuery),
      pool.query(userGrowthQuery),
      pool.query(countryDistQuery),
    ]);

    res.status(200).json({
      data: {
        quickStats: quickStats.rows[0],
        revenueTrend: revenueTrend.rows,
        topSellers: topSellers.rows,
        genreDistribution: genres.rows,
        userGrowth: userGrowth.rows,
        countryDistribution: countries.rows,
      },
    });
  } catch (error: any) {
    console.error("Dashboard Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
