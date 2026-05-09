import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Space, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Funnel } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import ManagementHeader from '../../../components/admin/ManagementHeader';
import GenreBadge from '../../../components/admin/setup/GenreComponent';

interface Movie {
  movie_id: string;
  title: string;
  release_date: string;
  price: number;
  rating: string;
  average_rating: number;
  total_reviews: number;
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
  const [genreFilters, setGenreFilters] = useState<{ text: string, value: string }[]>([]);

  // ฟังก์ชันดึงรายชื่อหนัง (ปรับให้รองรับการ Search ผ่าน Backend เหมือนหน้า Crew)
  const fetchMovies = async (search: string = '') => {
    setLoading(true);
    try {
      // 1. เรียก API ตามโครงสร้าง URL ที่คุณตั้งไว้ใน index.ts
      const response = await fetch(`http://localhost:5000/api/movies?search=${search}&limit=10`);
      if (!response.ok) throw new Error('Fetch failed');
      
      const result = await response.json();
      
      // 2. สำคัญ: ข้อมูลหนังจริงอยู่ใน result.data คับ
      setDataSource(result.data || []); 
      
    } catch (error) {
      console.error("Fetch Movies Error:", error);
      setDataSource([]); // เคลียร์ข้อมูลป้องกัน Error ค้าง
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/movies/${id}`, { method: 'DELETE' });
      if (response.ok) {
        message.success('Movie deleted successfully');
        fetchMovies(searchText);
      } else {
        throw new Error('Delete failed');
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to delete movie');
    }
  };

  const fetchGenresForFilter = async () => {
    try {
      // 3. ใช้ Route ที่คุณลงทะเบียนไว้ใน index.ts (/api/genres)
      const response = await fetch('http://localhost:5000/api/genres');
      if (!response.ok) throw new Error();
      const data = await response.json();
      
      // ใน genreController ส่งกลับมาเป็น array ของ row ตรงๆ
      setGenreFilters(data.map((g: any) => ({ text: g.genre_name, value: g.genre_name })));
    } catch (error) {
      console.error("Genre filter failed, using defaults");
    }
  };

  useEffect(() => {
    fetchMovies(searchText);
    fetchGenresForFilter();
  }, [searchText]);

  const columns: ColumnsType<Movie> = [
    { 
      title: 'ID', 
      dataIndex: 'movie_id', 
      key: 'movie_id', 
      width: '80px', 
      sorter: (a, b) => a.movie_id.localeCompare(b.movie_id) 
    },
    {
      title: 'TITLE',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text) => <span className="font-bold text-gray-900">{text}</span>,
    },
    { 
      title: 'RELEASE DATE', 
      dataIndex: 'release_date', 
      key: 'release_date',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime() 
    },
    { 
      title: 'PRICE', 
      dataIndex: 'price', 
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (price) => `฿${Number(price).toLocaleString()}` 
    },
    { 
    title: 'RATING', 
    dataIndex: 'rating', // อันนี้คือ Rating ของหนัง (เช่น PG-13, R)
    key: 'rating',
    filters: [{ text: 'NR', value: 'NR' }, { text: 'R', value: 'R' }, { text: 'PG-13', value: 'PG-13' }],
    onFilter: (value, record) => record.rating === value,
    filterIcon: (filtered) => <Funnel size={14} color={filtered ? '#3b82f6' : '#9ca3af'} />
  },
  { 
    title: 'AVG RATING', 
    dataIndex: 'average_rating', // แก้จาก review_rating เป็น average_rating ให้ตรงกับ API
    key: 'average_rating', 
    width: '120px',
    sorter: (a, b) => a.average_rating - b.average_rating,
    render: (rating, record) => (
      <span className="font-medium text-gray-700">
        {rating > 0 ? `${rating} ⭐` : 'No reviews'} 
      </span>
    )
  },
  { 
    title: 'TOTAL REVIEWS', 
    dataIndex: 'total_reviews', // เพิ่มคอลัมน์นี้เพื่อให้เห็นจำนวนคนรีวิว
    key: 'total_reviews', 
    width: '130px',
    render: (count) => <span className="text-gray-500">{count} reviews</span>,
    sorter: (a, b) => a.total_reviews - b.total_reviews 
  },
    { 
      title: 'COUNTRY', 
      dataIndex: 'country', 
      key: 'country',
      filters: [{ text: 'US', value: 'US' }, { text: 'KR', value: 'KR' }, { text: 'JP', value: 'JP' }],
      onFilter: (value, record) => record.country === value,
      filterIcon: (filtered) => <Funnel size={14} color={filtered ? '#3b82f6' : '#9ca3af'} />
    },
    {
      title: 'GENRE',
      dataIndex: 'genres',
      key: 'genres',
      filters: genreFilters,
      onFilter: (value, record) => record.genres.includes(value as string),
      filterIcon: (filtered) => <Funnel size={14} color={filtered ? '#3b82f6' : '#9ca3af'} />,
      render: (genres: string[]) => (
        <div className="flex flex-wrap gap-1 max-w-[150px]">
          {genres?.map(genre => <GenreBadge key={genre} genre={genre} />)}
        </div>
      ),
    },
    { 
      title: 'CREATE DATE', 
      dataIndex: 'create_date', 
      key: 'create_date',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.create_date).getTime() - new Date(b.create_date).getTime() 
    },
    {
      title: 'ACTION',
      key: 'action',
      width: '100px',
      render: (_, record: Movie) => (
        <Space size="middle">
          <EditOutlined 
            className="text-gray-400 hover:text-blue-600 cursor-pointer text-lg" 
            onClick={() => navigate(`/admin/movies/edit/${record.movie_id}`)} 
          />
          <Popconfirm
            title="Delete this movie?"
            description={`Are you sure to delete "${record.title}"?`}
            onConfirm={() => handleDelete(record.movie_id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <DeleteOutlined className="text-gray-400 hover:text-red-500 cursor-pointer text-lg" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <ManagementHeader 
        title="Content" 
        buttonText="Add Movie"
        onAdd={() => navigate('/admin/movies/add')} 
        searchText={searchText}
        onSearchChange={setSearchText}
        searchPlaceholder="Search by ID, Title..."
      />
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
        <Table 
          columns={columns} 
          dataSource={dataSource}
          loading={loading}
          rowKey="movie_id"
          pagination={{ 
            pageSize: 10,
            showTotal: (total, range) => (
              <span className="text-gray-400">Showing {range[0]} to {range[1]} of {total} results</span>
            )
          }}
          className="
            min-w-[1100px]
            [&_.ant-table-thead_th]:bg-white
            [&_.ant-table-thead_th]:text-gray-400
            [&_.ant-table-thead_th]:text-[13px]
            [&_.ant-table-thead_th]:font-semibold
            [&_.ant-table-column-sorters]:flex-row-reverse 
            [&_.ant-table-column-sorter]:mr-2
          "
        />
      </div>
    </div>
  );
}