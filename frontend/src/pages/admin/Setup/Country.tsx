import { useState, useEffect } from 'react';
import { Table, Input, Button, Space, message } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

interface Country {
  country_id: string; 
  english_name: string;
}

export default function CountrySetup() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [dataSource, setDataSource] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/countries?search=${searchText}`); 
      if (!response.ok) throw new Error('Fetch failed');
      const data = await response.json();
      setDataSource(data);
    } catch (error) {
    // 🚨 MOCKUP DATA: ส่วนนี้จะทำงานเมื่อหา Backend ไม่เจอ (คอมเมนต์ทิ้งได้เลยเมื่อเชื่อม API จริงเสร็จ)
      console.warn("Backend not found. Using Mockup Data instead.");
      setDataSource([
        { country_id: 'TH', english_name: 'Thailand' },
        { country_id: 'EN', english_name: 'England' },
        { country_id: 'CN', english_name: 'China' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchCountries(); 
  }, []);

  const columns: ColumnsType<Country> = [
    { 
      title: 'ID', 
      dataIndex: 'country_id', 
      key: 'country_id', 
      width: '15%',
      sorter: (a, b) => a.country_id.localeCompare(b.country_id), 
      render: (text) => <span className="font-bold text-gray-800">{text}</span> 
    },
    { 
      title: 'ENGLISH NAME', 
      dataIndex: 'english_name', 
      key: 'english_name', 
      width: '70%',
      sorter: (a, b) => a.english_name.localeCompare(b.english_name), 
      render: (text) => <span className="text-gray-500">{text}</span> 
    },
    {
      title: 'ACTION', 
      key: 'action', 
      width: '15%', 
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined 
            className="text-gray-400 hover:text-blue-600 cursor-pointer text-lg transition-colors" 
            onClick={() => navigate(`/admin/setups/country/edit/${record.country_id}`)} 
          />
          <DeleteOutlined 
            className="text-gray-400 hover:text-red-500 cursor-pointer text-lg transition-colors" 
            onClick={() => message.warning(`Delete country: ${record.english_name}`)} 
          />
        </Space>
      ),
    },
  ];

  const filteredData = dataSource.filter(item => item.english_name.toLowerCase().includes(searchText.toLowerCase()) || item.country_id.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <div className="p-4">

      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-md">
          <Input 
            placeholder="Search Country..." 
            prefix={<SearchOutlined className="text-gray-400" />} 
            value={searchText} 
            onChange={(e) => setSearchText(e.target.value)} 
            onPressEnter={() => fetchCountries()} 
            className="h-10 rounded-lg border-gray-300 shadow-sm" 
          />
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          className="h-10 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium shadow-md shadow-blue-600/20" 
          onClick={() => navigate('/admin/setups/country/add')}
        >
          Add Country
        </Button>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table columns={columns} dataSource={filteredData} loading={loading} rowKey="country_id" pagination={{ pageSize: 6, showTotal: (total, range) => <span className="text-gray-400 font-normal">Showing {range[0]} to {range[1]} of {total} results</span> }} className="[&_.ant-table-thead_th]:bg-gray-50/50 [&_.ant-table-thead_th]:border-b [&_.ant-table-thead_th]:text-[12px] [&_.ant-table-thead_th]:text-gray-400 [&_.ant-table-thead_th]:font-semibold [&_.ant-table-thead_th]:py-4 [&_.ant-table-column-sorters]:flex-row-reverse [&_.ant-table-column-sorters]:gap-2 [&_.ant-pagination]:!flex [&_.ant-pagination]:!w-full [&_.ant-pagination]:!px-6 [&_.ant-pagination]:!py-5 [&_.ant-pagination-total-text]:!mr-auto" />
      </div>
    </div>
  );
}