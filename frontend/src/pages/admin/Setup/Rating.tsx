import { useState, useEffect } from 'react';
import { Table, Input, Button, Space, message } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Funnel } from 'lucide-react'; 
import type { ColumnsType } from 'antd/es/table';

interface Rating {
  label: string; 
  maturity_lvl: number;
  description: string;
}

export default function RatingSetup() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [dataSource, setDataSource] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRatings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/ratings?search=${searchText}`); 
      if (!response.ok) throw new Error('Fetch failed');
      const data = await response.json();
      setDataSource(data);
    } catch (error) {
    // 🚨 MOCKUP DATA: ส่วนนี้จะทำงานเมื่อหา Backend ไม่เจอ (คอมเมนต์ทิ้งได้เลยเมื่อเชื่อม API จริงเสร็จ)
      console.warn("Backend not found. Using Mockup Data instead.");
      setDataSource([
        { label: 'G', maturity_lvl: 1, description: 'General Audiences — suitable for all ages.' },
        { label: 'PG', maturity_lvl: 2, description: 'Parental Guidance suggested — some material...' },
        { label: 'PG-13', maturity_lvl: 3, description: 'Parents strongly cautioned — some material...' },
        { label: 'TV-14', maturity_lvl: 4, description: 'Parents strongly cautioned for children under...' },
        { label: 'R', maturity_lvl: 5, description: 'Restricted — under 17 requires accompanying...' },
        { label: 'TV-MA', maturity_lvl: 5, description: 'Mature Audiences Only — may be unsuitable...' },
        { label: 'NC-17', maturity_lvl: 5, description: 'Adults Only — no one 17 and under admitted.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchRatings(); 
  }, []);

  const columns: ColumnsType<Rating> = [
    { 
      title: 'LABEL', 
      dataIndex: 'label', 
      key: 'label', 
      width: '150px', 
      filters: [
        { text: 'G', value: 'G' },
        { text: 'PG', value: 'PG' },
        { text: 'PG-13', value: 'PG-13' },
        { text: 'TV-14', value: 'TV-14' },
        { text: 'R', value: 'R' },
        { text: 'TV-MA', value: 'TV-MA' },
        { text: 'NC-17', value: 'NC-17' },
      ],
      onFilter: (value, record) => record.label === value,
      filterIcon: (filtered) => <Funnel size={16} color={filtered ? '#3b82f6' : '#9ca3af'} strokeWidth={filtered ? 3 : 2} />,
      render: (text) => <span className="font-medium text-gray-700">{text}</span> 
    },
    { 
      title: 'MATURITY-LVL', 
      dataIndex: 'maturity_lvl', 
      key: 'maturity_lvl', 
      width: '150px', 
      filters: [
        { text: 'Level 1', value: 1 },
        { text: 'Level 2', value: 2 },
        { text: 'Level 3', value: 3 },
        { text: 'Level 4', value: 4 },
        { text: 'Level 5', value: 5 },
      ],
      onFilter: (value, record) => record.maturity_lvl === value,
      filterIcon: (filtered) => <Funnel size={16} color={filtered ? '#3b82f6' : '#9ca3af'} strokeWidth={filtered ? 3 : 2} />,
      render: (lvl) => <span className="text-gray-500">{lvl}</span> 
    },
    { 
      title: 'DESCRIPTION', 
      dataIndex: 'description', 
      key: 'description', 
      sorter: (a, b) => a.description.localeCompare(b.description), 
      render: (text) => <span className="text-gray-500 truncate max-w-sm inline-block">{text}</span> 
    },
    {
      title: 'ACTION', key: 'action', width: '150px',
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined 
            className="text-gray-400 hover:text-blue-600 cursor-pointer text-lg transition-colors" 
            onClick={() => navigate(`/admin/setups/rating/edit/${record.label}`)} 
          />
          <DeleteOutlined 
            className="text-gray-400 hover:text-red-500 cursor-pointer text-lg transition-colors" 
            onClick={() => message.warning(`Delete rating: ${record.label}`)} 
          />
        </Space>
      ),
    },
  ];

  const filteredData = dataSource.filter(item => 
    item.label.toLowerCase().includes(searchText.toLowerCase()) || 
    item.description.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-4">

      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-md">
          <Input 
            placeholder="Search by content or quality..." 
            prefix={<SearchOutlined className="text-gray-400" />} 
            value={searchText} 
            onChange={(e) => setSearchText(e.target.value)} 
            onPressEnter={() => fetchRatings()}
            className="h-10 rounded-lg border-gray-300 shadow-sm" 
          />
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          className="h-10 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium shadow-md shadow-blue-600/20" 
          onClick={() => navigate('/admin/setups/rating/add')}
        >
          Add Rating
        </Button>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/*ถ้าใช้ Backend Search เต็มตัว ให้เปลี่ยน dataSource={filteredData} เป็น dataSource={dataSource} */}
        <Table columns={columns} dataSource={filteredData} loading={loading} rowKey="label" pagination={{ pageSize: 8, showTotal: (total, range) => <span className="text-gray-400 font-normal">Showing {range[0]} to {range[1]} of {total} results</span> }} className="[&_.ant-table-thead_th]:bg-gray-50/50 [&_.ant-table-thead_th]:border-b [&_.ant-table-thead_th]:text-[12px] [&_.ant-table-thead_th]:text-gray-400 [&_.ant-table-thead_th]:font-semibold [&_.ant-table-thead_th]:py-4 [&_.ant-table-column-sorters]:flex-row-reverse [&_.ant-table-column-sorters]:gap-2 [&_.ant-table-filter-column]:flex-row-reverse [&_.ant-table-filter-column]:justify-end [&_.ant-table-filter-column]:gap-2 [&_.ant-pagination]:!flex [&_.ant-pagination]:!w-full [&_.ant-pagination]:!px-6 [&_.ant-pagination]:!py-5 [&_.ant-pagination-total-text]:!mr-auto" />
      </div>
    </div>
  );
}