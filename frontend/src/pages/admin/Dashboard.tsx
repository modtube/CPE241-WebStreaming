import React, { useState, useEffect } from 'react';
import { Table, message, Spin } from 'antd';
import { 
  VideoCameraOutlined, 
  UserOutlined, 
  DollarOutlined, 
  StarOutlined 
} from '@ant-design/icons';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';

// --- คอมโพเนนต์ย่อยสำหรับการ์ดสถิติ ---
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendColor?: string;
}

const StatCard = ({ title, value, icon, trend, trendColor }: StatCardProps) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
    <div className="flex justify-between items-start">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</span>
        <h2 className="text-2xl font-black text-gray-800 mt-1">{value}</h2>
      </div>
      <div className="p-3 bg-gray-50 rounded-lg text-blue-600">
        {icon}
      </div>
    </div>
    {trend && (
      <div className={`text-xs font-bold ${trendColor || 'text-green-500'} flex items-center gap-1`}>
        {trend}
      </div>
    )}
  </div>
);

// --- หน้า Dashboard หลัก ---

// เตรียมสีไว้ 15 สีเพื่อให้รองรับหมวดหมู่ที่เยอะ
const COLORS = [
  '#4F46E5', '#10B981', '#3B82F6', '#F59E0B', '#EC4899', 
  '#8B5CF6', '#EF4444', '#06B6D4', '#F97316', '#84CC16',
  '#0EA5E9', '#D946EF', '#6366F1', '#14B8A6', '#F43F5E'
];

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard')
      .then(res => res.json())
      .then(json => {
        // แปลงข้อมูลสถิติให้เป็น Number และเรียงลำดับข้อมูลก่อนแสดงผล
        const processed = {
          ...json,
          revenueTrend: json.revenueTrend?.map((item: any) => ({
            ...item,
            amount: parseFloat(item.amount) || 0
          })) || [],
          genreDistribution: json.genreDistribution?.map((item: any) => ({
            ...item,
            value: parseInt(item.value, 10) || 0
          })).sort((a: any, b: any) => b.value - a.value) || [], 
          userGrowth: json.userGrowth?.map((item: any) => ({
            ...item,
            count: parseInt(item.count, 10) || 0
          })) || [],
          countryDistribution: json.countryDistribution?.map((item: any) => ({
            ...item,
            value: parseInt(item.value, 10) || 0
          })).sort((a: any, b: any) => b.value - a.value) || []
        };

        setData(processed);
        setLoading(false);
      })
      .catch(() => {
        message.error('ไม่สามารถโหลดข้อมูล Dashboard ได้');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Spin size="large" tip="กำลังโหลดข้อมูล..." />
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col gap-8 text-sans">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* 1. Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Movies" 
          value={data?.quickStats?.total_movies || 0} 
          icon={<VideoCameraOutlined className="text-xl" />} 
          trend="+2.5% this month"
        />
        <StatCard 
          title="Total Users" 
          value={Number(data?.quickStats?.total_users || 0).toLocaleString()} 
          icon={<UserOutlined className="text-xl" />} 
          trend="+1.5% this month"
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${Number(data?.quickStats?.total_revenue || 0).toLocaleString()}`} 
          icon={<DollarOutlined className="text-xl" />} 
          trend="+12.5% from last period"
          trendColor="text-green-500"
        />
        <StatCard 
          title="Average Rating" 
          value={`${Number(data?.quickStats?.avg_rating || 0).toFixed(1)} / 5.0`} 
          icon={<StarOutlined className="text-xl text-yellow-500" />} 
        />
      </div>

      {/* 2. Revenue Trend (Line Chart) */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Revenue Trend ($)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
              <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Line type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={4} dot={{ r: 6, fill: '#4F46E5', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Middle Row: Top Sellers & Genre Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Top 5 Best Sellers</h3>
          <Table 
            dataSource={data?.topSellers} 
            rowKey="id" // ใช้ string ID เป็นคีย์
            columns={[
              { 
                title: 'ID', 
                dataIndex: 'id', 
                key: 'id',
                sorter: (a: any, b: any) => (a.id || "").localeCompare(b.id || "")              },
              { title: 'TITLE', dataIndex: 'title', key: 'title', render: (text) => <span className="font-bold">{text}</span> },
              { title: 'UNITS', dataIndex: 'units_sold', key: 'units_sold', align: 'center' },
              { title: 'TOTAL', dataIndex: 'total', key: 'total', align: 'right', render: (val) => `$${Number(val).toLocaleString()}` }
            ]}
            pagination={false}
            size="middle"
          />
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Movie Distribution by Genre</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.genreDistribution} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontSize: 11}} width={100} />
                <Tooltip cursor={{fill: '#F9FAFB'}} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14}>
                  {data?.genreDistribution.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: User Growth & Country Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6">User Growth (Cumulative)</h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data?.userGrowth}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                        <Tooltip contentStyle={{borderRadius: '12px'}} />
                        <Line type="monotone" dataKey="count" stroke="#EC4899" strokeWidth={3} dot={{ fill: '#EC4899', r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Top Countries</h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.countryDistribution?.slice(0, 10)} layout="vertical" margin={{ left: 10 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontSize: 10}} width={80} />
                        <Tooltip />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
                          {data?.countryDistribution?.slice(0, 10).map((_: any, i: number) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
}