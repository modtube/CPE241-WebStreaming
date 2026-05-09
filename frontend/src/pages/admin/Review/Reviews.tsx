import { useState, useEffect } from 'react';
import { Table, Input, Button, message, Dropdown } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Funnel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import ReviewStatus from '../../../components/admin/ReviewStatus'; 

interface Review {
  review_id: string;
  user_id: string;
  movie_id: string;
  rating: number;
  status: 'Active' | 'Suspended' | 'Banned'; 
  post_time: string;
  comment: string;
}

export default function Reviews() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [dataSource, setDataSource] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // TODO: เปิดใช้งานเมื่อ Backend เสร็จแล้ว
      throw new Error('Trigger Mockup'); 
    } catch (error) {
      // 🚨 MOCKUP DATA
      console.warn("Backend not found. Using Reviews Mockup Data instead.");
      setDataSource([
        { review_id: '001', user_id: '001', movie_id: '001', rating: 4.5, status: 'Active', post_time: '2010-07-16', comment: 'เนื้อเรื่องดี สนุกมากกกกกกกกกกกกกกกกกกกกกกกกกกกกก' },
        { review_id: '002', user_id: '002', movie_id: '002', rating: 4.5, status: 'Suspended', post_time: '2010-07-16', comment: 'ฉากที่ตัวเอกออกตอนหน้าคือโคตรจะเท่ห์' },
        { review_id: '003', user_id: '003', movie_id: '003', rating: 4.5, status: 'Banned', post_time: '2010-07-16', comment: 'แพลตฟอร์มไม่ได้เรื่อง ห่วยแตกสิ้นดี' },
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

  const handleStatusChange = async (reviewId: string, newStatus: string) => {
    try {
      // TODO: เปิดคอมเมนต์เมื่อต่อ Backend เสร็จแล้ว
      /*
      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Update failed');
      */
      
      setDataSource(prevData => 
        prevData.map(review => review.review_id === reviewId ? { ...review, status: newStatus as Review['status'] } : review)
      );
      message.success(`Status updated to ${newStatus}`);
    } catch (error) {
      message.error('Failed to update status');
    }
  };

  const columns: ColumnsType<Review> = [
    { 
      title: 'ID', 
      dataIndex: 'review_id', 
      key: 'review_id', 
      sorter: (a, b) => a.review_id.localeCompare(b.review_id) 
    },
    { 
      title: 'USER ID', 
      dataIndex: 'user_id', 
      key: 'user_id', 
      sorter: (a, b) => a.user_id.localeCompare(b.user_id),
      render: (text) => <span className="font-medium text-gray-800">{text}</span>
    },
    { 
      title: 'MOVIE ID', 
      dataIndex: 'movie_id', 
      key: 'movie_id', 
      sorter: (a, b) => a.movie_id.localeCompare(b.movie_id),
      render: (text) => <span className="text-gray-500">{text}</span>
    },
    { 
      title: 'REVIEW RATING', 
      dataIndex: 'rating', 
      key: 'rating',
      filters: [{ text: '5.0', value: 5.0 }, { text: '4.5', value: 4.5 }, { text: '4.0', value: 4.0 }],
      onFilter: (value, record) => record.rating === value,
      filterIcon: (filtered) => <Funnel size={16} color={filtered ? '#3b82f6' : '#9ca3af'} strokeWidth={filtered ? 3 : 2} />,
      render: (rating) => <span className="text-gray-600">{rating.toFixed(1)}</span>
    },
    { 
      title: 'STATUS', 
      dataIndex: 'status', 
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status, record) => {
        const items: MenuProps['items'] = [
          { key: 'Active', label: 'Active' },
          { key: 'Suspended', label: 'Suspended' },
          { key: 'Banned', label: 'Banned' },
        ];
        return (
          <Dropdown menu={{ items, onClick: ({ key }) => handleStatusChange(record.review_id, key) }} trigger={['click']}>
            <div className="cursor-pointer hover:opacity-80 transition-opacity inline-block">
              {/* 💡 เรียกใช้ Component ReviewStatus */}
              <ReviewStatus status={status} />
            </div>
          </Dropdown>
        );
      }
    },
    { 
      title: 'POST TIME', 
      dataIndex: 'post_time', 
      key: 'post_time', 
      sorter: (a, b) => new Date(a.post_time).getTime() - new Date(b.post_time).getTime() 
    },
    { 
      title: 'COMMENT', 
      dataIndex: 'comment', 
      key: 'comment', 
      sorter: (a, b) => a.comment.localeCompare(b.comment),
      render: (text) => <span className="text-gray-500 truncate max-w-[200px] inline-block">{text}</span>
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

  const filteredData = dataSource.filter((review) =>
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
            onClick={() => message.warning(`Deleting ${selectedRowKeys.length} reviews...`)}
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
            showTotal: (total, range) => <span className="text-gray-400 font-normal">Showing {range[0]} to {range[1]} of {total} results</span>
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