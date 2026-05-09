import { useState, useEffect } from 'react';
import { Table, Input, Button, message, Space } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Funnel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import GenreBadge from '../../components/admin/Genre';

interface Movie {
  movie_id: string;
  title: string;
  release_date: string;
  price: number;
  rating: string;
  review_rating: number;
  country: string;
  genres: string[];
  create_date: string;
  update_date: string;
}

export default function Movies() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [dataSource, setDataSource] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State สำหรับเก็บตัวเลือก Filter ของ Genre ที่ดึงมาจาก Backend
  const [genreFilters, setGenreFilters] = useState<{text: string, value: string}[]>([]);

  // ฟังก์ชันดึงรายชื่อหนัง
  const fetchMovies = async () => {
    setLoading(true);
    try {
      // TODO: เปิดใช้งานเมื่อ Backend เสร็จแล้ว
      /*
      const response = await fetch('http://localhost:5000/api/movies'); 
      if (!response.ok) throw new Error('Fetch failed');
      const data = await response.json();
      setDataSource(data);
      */
      throw new Error('Trigger Mockup'); 
    } catch (error) {
      // 🚨 MOCKUP DATA
      console.warn("Backend not found. Using Movies Mockup Data instead.");
      setDataSource([
        { movie_id: '001', title: 'Inception', release_date: '2010-07-16', price: 299.00, rating: 'NR', review_rating: 4.8, country: 'US', genres: ['Action', 'Sci-Fi'], create_date: '2026-01-16', update_date: '2026-01-16' },
        { movie_id: '002', title: 'Dune: Part Two', release_date: '2024-03-01', price: 349.00, rating: 'NR', review_rating: 4.4, country: 'US', genres: ['Adventure', 'Sci-Fi'], create_date: '2026-03-01', update_date: '2026-03-01' },
        { movie_id: '003', title: 'Parasite', release_date: '2019-05-30', price: 249.00, rating: 'NR', review_rating: 4.2, country: 'KR', genres: ['Drama', 'Thriller'], create_date: '2026-05-30', update_date: '2026-05-30' },
        { movie_id: '004', title: 'Spirited Away', release_date: '2001-07-20', price: 199.00, rating: 'NR', review_rating: 4.8, country: 'JP', genres: ['Fantasy', 'Animation'], create_date: '2026-07-20', update_date: '2026-07-20' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันดึง Master Data ของ Genre มาทำเป็นเมนู Filter
  const fetchGenresForFilter = async () => {
    try {
      // TODO: เปิดใช้งานเมื่อต่อ Backend
      /*
      const response = await fetch('http://localhost:5000/api/genres');
      const data = await response.json();
      setGenreFilters(data.map((g: any) => ({ text: g.genre_name, value: g.genre_name })));
      */

      // 🚨 MOCKUP DATA ของ Filter
      setGenreFilters([
        { text: 'Action', value: 'Action' },
        { text: 'Sci-Fi', value: 'Sci-Fi' },
        { text: 'Adventure', value: 'Adventure' },
        { text: 'Drama', value: 'Drama' },
        { text: 'Thriller', value: 'Thriller' },
        { text: 'Fantasy', value: 'Fantasy' },
        { text: 'Animation', value: 'Animation' },
      ]);
    } catch (error) {
      console.error("Failed to load genres for filter");
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchGenresForFilter();
  }, []);

  // ตั้งค่า Columns ตาราง
  const columns: ColumnsType<Movie> = [
    { 
      title: 'ID', 
      dataIndex: 'movie_id', 
      key: 'movie_id', 
      width: '70px', 
      sorter: (a, b) => a.movie_id.localeCompare(b.movie_id) 
    },
    {
      title: 'TITLE',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text) => <span className="font-bold text-gray-800">{text}</span>,
    },
    { 
      title: 'RELEASE DATE', 
      dataIndex: 'release_date', 
      key: 'release_date', 
      sorter: (a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime() 
    },
    { 
      title: 'PRICE', 
      dataIndex: 'price', 
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (price) => `$${price.toFixed(2)}` 
    },
    { 
      title: 'RATING', 
      dataIndex: 'rating', 
      key: 'rating',
      filters: [{ text: 'NR', value: 'NR' }, { text: 'R', value: 'R' }, { text: 'PG-13', value: 'PG-13' }],
      onFilter: (value, record) => record.rating === value,
      filterIcon: (filtered) => <Funnel size={16} color={filtered ? '#3b82f6' : '#9ca3af'} strokeWidth={filtered ? 3 : 2} />
    },
    { 
      title: 'REVIEW RATING', 
      dataIndex: 'review_rating', 
      key: 'review_rating', 
      sorter: (a, b) => a.review_rating - b.review_rating 
    },
    { 
      title: 'COUNTRY', 
      dataIndex: 'country', 
      key: 'country',
      filters: [{ text: 'US', value: 'US' }, { text: 'KR', value: 'KR' }, { text: 'JP', value: 'JP' }],
      onFilter: (value, record) => record.country === value,
      filterIcon: (filtered) => <Funnel size={16} color={filtered ? '#3b82f6' : '#9ca3af'} strokeWidth={filtered ? 3 : 2} />
    },
    {
      title: 'GENRE',
      dataIndex: 'genres',
      key: 'genres',
      filters: genreFilters, // 💡 โยนตัวเลือกที่โหลดจาก Backend เข้ามาตรงนี้
      onFilter: (value, record) => record.genres.includes(value as string),
      filterIcon: (filtered) => <Funnel size={16} color={filtered ? '#3b82f6' : '#9ca3af'} strokeWidth={filtered ? 3 : 2} />,
      render: (genres: string[]) => (
        <div className="flex flex-wrap max-w-[150px]">
          {genres.map(genre => <GenreBadge key={genre} genre={genre} />)}
        </div>
      ),
    },
    { 
      title: 'CREATE DATE', 
      dataIndex: 'create_date', 
      key: 'create_date', 
      sorter: (a, b) => new Date(a.create_date).getTime() - new Date(b.create_date).getTime() 
    },
    { 
      title: 'UPDATE DATE', 
      dataIndex: 'update_date', 
      key: 'update_date', 
      sorter: (a, b) => new Date(a.update_date).getTime() - new Date(b.update_date).getTime() 
    },
    {
      title: 'ACTION',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined className="text-gray-400 hover:text-blue-600 cursor-pointer text-lg" onClick={() => navigate(`/admin/movies/edit/${record.movie_id}`)} />
          <DeleteOutlined className="text-gray-400 hover:text-red-500 cursor-pointer text-lg" onClick={() => message.warning(`Delete movie: ${record.title}`)} />
        </Space>
      ),
    },
  ];

  // ระบบค้นหา (กรองจาก Title)
  const filteredData = dataSource.filter((movie) =>
    movie.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* ส่วน Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-md">
          <Input
            placeholder="Search content by title..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="h-10 rounded-lg border-gray-300 shadow-sm"
          />
        </div>
        
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          className="h-10 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium shadow-md shadow-blue-600/20"
          onClick={() => navigate('/admin/movies/add')}
        >
          Add Content
        </Button>
      </div>
      
      {/* ส่วน Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
        <Table 
          columns={columns} 
          dataSource={filteredData}
          loading={loading}
          rowKey="movie_id"
          pagination={{ 
            pageSize: 5,
            showTotal: (total, range) => <span className="text-gray-400 font-normal">Showing {range[0]} to {range[1]} of {total} results</span>,
            itemRender: (_, type, originalElement) => {
              if (type === 'prev') return <Button className="text-gray-600 rounded-md border-gray-200 px-4 h-9">Back</Button>;
              if (type === 'next') return <Button className="text-gray-600 rounded-md border-gray-200 px-4 h-9">Next</Button>;
              return originalElement;
            }
          }}
          className="
            min-w-[1200px] /* ป้องกันตารางบีบตัวจนพังถ้าย่อจอ */
            [&_.ant-table-thead_th]:bg-white
            [&_.ant-table-thead_th]:border-b
            [&_.ant-table-thead_th]:text-[12px] 
            [&_.ant-table-thead_th]:text-gray-400
            [&_.ant-table-thead_th]:font-semibold 
            [&_.ant-table-thead_th]:py-4
            [&_.ant-table-row_td]:py-4
            
            /* ใช้ gap จัดระยะห่างให้ Sort และ Filter */
            [&_.ant-table-column-sorters]:flex-row-reverse 
            [&_.ant-table-column-sorters]:gap-2
            
            [&_.ant-table-filter-column]:flex-row-reverse 
            [&_.ant-table-filter-column]:justify-end
            [&_.ant-table-filter-column]:gap-2
            
            [&_.ant-pagination]:!flex 
            [&_.ant-pagination]:!w-full 
            [&_.ant-pagination]:!px-6 
            [&_.ant-pagination]:!py-5
            [&_.ant-pagination-total-text]:!mr-auto 
            [&_.ant-pagination-item]:!hidden
          "
        />
      </div>
    </div>
  );
}