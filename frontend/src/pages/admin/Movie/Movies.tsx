import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Space, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Funnel } from 'lucide-react';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
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
  const [pagination, setPagination] = useState({ 
    current: 1, 
    pageSize: 10, 
    total: 0 
  });
  const [genreFilters, setGenreFilters] = useState<{ text: string, value: string }[]>([]);

  // ฟังก์ชันดึงรายชื่อหนัง พร้อมระบบ Sorting, Filtering และ Pagination จาก Server
  // แก้ไขฟังก์ชัน fetchMovies
  const fetchMovies = async (params: any = {}) => {
    setLoading(true);
    try {
      const page = params.pagination?.current || 1;
      const pageSize = params.pagination?.pageSize || 10;
      const filters = params.filters || {};
      
      const sortBy = params.sorter?.field || '';
      const sortOrder = params.sorter?.order || '';

      const query = new URLSearchParams({
        search: searchText,
        page: String(page),
        limit: String(pageSize),
        genre: Array.isArray(filters.genres) ? filters.genres[0] : filters.genres || '',
        rating: Array.isArray(filters.rating) ? filters.rating[0] : filters.rating || '',
        // --- เพิ่มบรรทัดนี้ลงไป ---
        country: Array.isArray(filters.country) ? filters.country[0] : filters.country || '',
        // -----------------------
        sortBy: sortBy,
        sortOrder: sortOrder,
      }).toString();

      const response = await fetch(`http://localhost:5000/api/movies?${query}`);
      const result = await response.json();

      setDataSource(result.data || []);
      setPagination({
        current: result.pagination?.current_page || page,
        pageSize: result.pagination?.limit || pageSize,
        total: result.pagination?.total_items || 0,
      });
    } catch (error) {
      message.error("Failed to fetch movies");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/movies/${id}`, { method: 'DELETE' });
      if (response.ok) {
        message.success('Movie deleted successfully');
        fetchMovies({ pagination: { current: 1 } }); // กลับไปหน้าแรกหลังลบ
      } else {
        throw new Error('Delete failed');
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to delete movie');
    }
  };

  const fetchGenresForFilter = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/genres');
      if (!response.ok) throw new Error();
      const data = await response.json();
      setGenreFilters(data.map((g: any) => ({ text: g.genre_name, value: g.genre_name })));
    } catch (error) {
      console.error("Genre filter failed");
    }
  };

  useEffect(() => {
    // โหลดข้อมูลใหม่เมื่อ SearchText เปลี่ยน (Reset กลับไปหน้า 1)
    fetchMovies({ pagination: { current: 1 } });
    fetchGenresForFilter();
  }, [searchText]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '-' : date.toISOString().split('T')[0];
  };

  const columns: ColumnsType<Movie> = [
    { 
      title: 'ID', 
      dataIndex: 'movie_id', 
      key: 'movie_id', 
      width: '90px', 
      sorter: true // เปิดใช้งาน Server-side sorting
    },
    {
      title: 'TITLE',
      dataIndex: 'title',
      key: 'title',
      width: '180px',
      sorter: true, // เปิดใช้งาน Server-side sorting
      render: (text) => <span className="font-bold text-gray-800">{text}</span>,
    },
    { 
      title: 'RELEASE DATE', 
      dataIndex: 'release_date', 
      key: 'release_date',
      width: '130px',
      render: (date) => formatDate(date),
      sorter: true // เปิดใช้งาน Server-side sorting
    },
    { 
      title: 'PRICE', 
      dataIndex: 'price', 
      key: 'price',
      width: '100px',
      sorter: true, // เปิดใช้งาน Server-side sorting
      render: (price) => {
        const numPrice = parseFloat(String(price));
        return isNaN(numPrice) ? '$0.00' : `$${numPrice.toFixed(2)}`;
      }
    },
    { 
      title: 'RATING', 
      dataIndex: 'rating', 
      key: 'rating',
      width: '100px',
      filters: [{ text: 'NR', value: 'NR' }, { text: 'R', value: 'R' }, { text: 'PG-13', value: 'PG-13' }],
      filterIcon: (filtered) => <Funnel size={14} color={filtered ? '#3b82f6' : '#9ca3af'} />
    },
    { 
      title: 'REVIEW RATING', 
      dataIndex: 'average_rating', 
      key: 'average_rating', 
      width: '130px',
      sorter: true, // เปิดใช้งาน Server-side sorting
      render: (rating) => (
        <span className="text-gray-700">
          {rating > 0 ? Number(rating).toFixed(1) : '0.0'}
        </span>
      )
    },
    { 
      title: 'COUNTRY', 
      dataIndex: 'country', 
      key: 'country',
      width: '100px',
      filters: [{ text: 'US', value: 'US' }, { text: 'KR', value: 'KR' }, { text: 'JP', value: 'JP' }],
      filterIcon: (filtered) => <Funnel size={14} color={filtered ? '#3b82f6' : '#9ca3af'} />
    },
    {
      title: 'GENRE',
      dataIndex: 'genres',
      key: 'genres',
      width: '180px',
      filters: genreFilters,
      filterIcon: (filtered) => <Funnel size={14} color={filtered ? '#3b82f6' : '#9ca3af'} />,
      render: (genres: string[]) => (
        <div className="flex flex-wrap gap-1">
          {genres?.map(genre => <GenreBadge key={genre} genre={genre} />)}
        </div>
      ),
    },
    { 
      title: 'CREATE DATE', 
      dataIndex: 'create_date', 
      key: 'create_date',
      width: '120px',
      render: (date) => formatDate(date),
      sorter: true
    },
    {
      title: 'ACTION',
      key: 'action',
      fixed: 'right',
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
        title="Movies Management" 
        buttonText="Add Content"
        onAdd={() => navigate('/admin/movies/add')} 
        searchText={searchText}
        onSearchChange={setSearchText}
        searchPlaceholder="Search content by title..."
      />
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table 
          columns={columns} 
          dataSource={dataSource}
          loading={loading}
          rowKey="movie_id"
          scroll={{ x: 1300 }}
          pagination={{ 
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showTotal: (total, range) => (
              <span className="text-gray-400 text-xs">Showing {range[0]} to {range[1]} of {total} results</span>
            )
          }}
          // เมื่อมีการเปลี่ยนหน้า, filter หรือ sorter จะเรียก fetchMovies ใหม่พร้อมส่งค่าไป Backend
          onChange={(tablePagination, filters, sorter) => {
            fetchMovies({ pagination: tablePagination, filters, sorter });
          }}
          className="
            [&_.ant-table-thead_th]:bg-white
            [&_.ant-table-thead_th]:text-gray-400
            [&_.ant-table-thead_th]:text-[12px]
            [&_.ant-table-thead_th]:font-semibold
            [&_.ant-table-thead_th]:py-4
            [&_.ant-table-row_td]:py-4
            [&_.ant-table-column-sorters]:flex-row-reverse 
            [&_.ant-table-column-sorter]:mr-2
          "
        />
      </div>
    </div>
  );
}