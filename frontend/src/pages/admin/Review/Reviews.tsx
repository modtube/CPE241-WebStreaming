import { useState, useEffect, useMemo } from 'react';
import { Table, Input, Button, message, Dropdown } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Funnel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import ReviewStatus from '../../../components/admin/review/ReviewStatus';

const API_BASE = 'http://localhost:5000';

// Status ต้องตรงกับ CHECK constraint ใน schema
type PostStatus = 'Published' | 'Hidden' | 'Removed';

// Type ที่ backend ส่งกลับมาจาก GET /api/reviews
interface ReviewRow {
  review_id: string;
  user_id: string | null;
  username: string | null;
  movie_id: string;
  movie_title: string | null;
  rating: string; // backend ส่งมาเป็น string ของ NUMERIC เช่น "4.5"
  comment_text: string | null;
  post_time: string; // ISO timestamp
  post_status: PostStatus;
}

// Type ภายใน table ของ Ant Design
interface Review {
  review_id: string;
  user_id: string;
  movie_id: string;
  rating: number;
  status: PostStatus;
  post_time: string; // YYYY-MM-DD เพื่อแสดงในตาราง
  comment: string;
}

export default function Reviews() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [dataSource, setDataSource] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // โหลด reviews จาก backend
  const fetchReviews = async () => {
    setLoading(true);
    try {
      // ดึงเยอะๆ มา 1 ครั้ง แล้วให้ Ant Design จัดการ pagination/sort/filter ฝั่ง client
      const res = await fetch(`${API_BASE}/api/reviews?limit=100`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as { data: ReviewRow[] };

      const mapped: Review[] = json.data.map((r) => ({
        review_id: r.review_id,
        user_id: r.user_id ?? '-',
        movie_id: r.movie_id,
        rating: parseFloat(r.rating),
        status: r.post_status,
        post_time: r.post_time.slice(0, 10), // YYYY-MM-DD
        comment: r.comment_text ?? '',
      }));
      setDataSource(mapped);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      message.error('โหลด reviews ไม่สำเร็จ — ตรวจสอบว่า backend รันอยู่');
      // Mockup data — fallback ถ้า backend ไม่ตอบ
      setDataSource([
        { review_id: 'V00001', user_id: 'U00001', movie_id: 'M00001', rating: 4.5, status: 'Published', post_time: '2024-01-20', comment: 'เนื้อเรื่องดี สนุกมาก' },
        { review_id: 'V00002', user_id: 'U00002', movie_id: 'M00002', rating: 4.5, status: 'Hidden', post_time: '2024-02-10', comment: 'ฉากตัวเอกออกตอนแรกเท่ห์มาก' },
        { review_id: 'V00003', user_id: 'U00003', movie_id: 'M00003', rating: 4.5, status: 'Removed', post_time: '2024-02-25', comment: 'ห่วยแตก ไม่แนะนำ' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // เปลี่ยน status (Published / Hidden / Removed)
  const handleStatusChange = async (reviewId: string, newStatus: PostStatus) => {
    try {
      const res = await fetch(`${API_BASE}/api/reviews/${reviewId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_status: newStatus }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // อัปเดตใน table ทันที
      setDataSource((prev) =>
        prev.map((r) => (r.review_id === reviewId ? { ...r, status: newStatus } : r))
      );
      message.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Update status failed:', error);
      message.error('Failed to update status');
    }
  };

  // ลบหลาย review ในครั้งเดียว
  const handleDeleteSelected = async () => {
    if (selectedRowKeys.length === 0) return;
    if (!confirm(`ยืนยันลบ ${selectedRowKeys.length} review?`)) return;

    try {
      await Promise.all(
        selectedRowKeys.map((id) =>
          fetch(`${API_BASE}/api/reviews/${id}`, { method: 'DELETE' })
        )
      );
      message.success(`Deleted ${selectedRowKeys.length} reviews`);
      setSelectedRowKeys([]);
      fetchReviews();
    } catch (error) {
      console.error('Delete failed:', error);
      message.error('ลบไม่สำเร็จ');
    }
  };

  // ตัวเลือก rating สำหรับ funnel filter — สร้างจากข้อมูลจริงที่มี
  const ratingFilterOptions = useMemo(() => {
    const uniqueRatings = Array.from(new Set(dataSource.map((r) => r.rating))).sort(
      (a, b) => b - a
    );
    return uniqueRatings.map((v) => ({ text: v.toFixed(1), value: v }));
  }, [dataSource]);

  const columns: ColumnsType<Review> = [
    {
      title: 'ID',
      dataIndex: 'review_id',
      key: 'review_id',
      defaultSortOrder: 'ascend', // default: sort น้อย→มาก ที่ ID column ตอนเปิดหน้า
      sorter: (a, b) => a.review_id.localeCompare(b.review_id),
    },
    {
      title: 'USER ID',
      dataIndex: 'user_id',
      key: 'user_id',
      sorter: (a, b) => a.user_id.localeCompare(b.user_id),
      render: (text) => <span className="font-medium text-gray-800">{text}</span>,
    },
    {
      title: 'MOVIE ID',
      dataIndex: 'movie_id',
      key: 'movie_id',
      sorter: (a, b) => a.movie_id.localeCompare(b.movie_id),
      render: (text) => <span className="text-gray-500">{text}</span>,
    },
    {
      title: 'REVIEW RATING',
      dataIndex: 'rating',
      key: 'rating',
      filters: ratingFilterOptions,
      onFilter: (value, record) => record.rating === value,
      filterIcon: (filtered) => (
        <Funnel
          size={16}
          color={filtered ? '#3b82f6' : '#9ca3af'}
          strokeWidth={filtered ? 3 : 2}
        />
      ),
      render: (rating: number) => <span className="text-gray-600">{rating.toFixed(1)}</span>,
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      // กำหนดลำดับ status เอง: Published(0) < Hidden(1) < Removed(2)
      // asc → Published → Hidden → Removed
      // desc → Removed → Hidden → Published
      sorter: (a, b) => {
        const order: Record<PostStatus, number> = {
          Published: 0,
          Hidden: 1,
          Removed: 2,
        };
        return order[a.status] - order[b.status];
      },
      render: (status: PostStatus, record) => {
        const items: MenuProps['items'] = [
          { key: 'Published', label: 'Published' },
          { key: 'Hidden', label: 'Hidden' },
          { key: 'Removed', label: 'Removed' },
        ];
        return (
          <Dropdown
            menu={{
              items,
              onClick: ({ key }) => handleStatusChange(record.review_id, key as PostStatus),
            }}
            trigger={['click']}
          >
            <div className="cursor-pointer hover:opacity-80 transition-opacity inline-block">
              <ReviewStatus status={status} />
            </div>
          </Dropdown>
        );
      },
    },
    {
      title: 'POST TIME',
      dataIndex: 'post_time',
      key: 'post_time',
      sorter: (a, b) => new Date(a.post_time).getTime() - new Date(b.post_time).getTime(),
    },
    {
      title: 'COMMENT',
      dataIndex: 'comment',
      key: 'comment',
      sorter: (a, b) => a.comment.localeCompare(b.comment),
      render: (text) => (
        <span className="text-gray-500 truncate max-w-[200px] inline-block">{text}</span>
      ),
    },
    {
      title: 'ACTION',
      key: 'action',
      render: (_, record) => (
        <span
          className="text-blue-600 font-semibold cursor-pointer hover:text-blue-800 transition-colors"
          onClick={() => navigate(`/admin/reviews/${record.review_id}`)}
        >
          View Detail
        </span>
      ),
    },
  ];

  // Search ฝั่ง client (id-based)
  const filteredData = dataSource.filter(
    (review) =>
      review.review_id.toLowerCase().includes(searchText.toLowerCase()) ||
      review.user_id.toLowerCase().includes(searchText.toLowerCase()) ||
      review.movie_id.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-md">
          <Input
            placeholder="Search by ID..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="h-10 rounded-lg border-gray-300 shadow-sm"
          />
        </div>

        {selectedRowKeys.length > 0 && (
          <Button
            danger
            className="h-10 px-6 rounded-lg font-medium border-red-200 text-red-500 hover:bg-red-50"
            onClick={handleDeleteSelected}
          >
            Delete ({selectedRowKeys.length})
          </Button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          rowKey="review_id"
          pagination={{
            pageSize: 5,
            showTotal: (total, range) => (
              <span className="text-gray-400 font-normal">
                Showing {range[0]} to {range[1]} of {total} results
              </span>
            ),
          }}
          className="
            min-w-[1000px]
            [&_.ant-table-thead_th]:bg-white
            [&_.ant-table-thead_th]:border-b
            [&_.ant-table-thead_th]:text-[12px] 
            [&_.ant-table-thead_th]:text-gray-400
            [&_.ant-table-thead_th]:font-semibold 
            [&_.ant-table-thead_th]:py-4
            [&_.ant-table-row_td]:py-4
            
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
          "
        />
      </div>
    </div>
  );
}
