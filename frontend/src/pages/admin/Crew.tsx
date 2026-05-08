import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ManagementHeader from '../../components/admin/ManagementHeader';

interface CrewRecord {
  id: string;
  firstName: string;
  lastName: string;
  nationality: string;
  birthDate: string;
}

export default function Crew() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  const columns: ColumnsType<CrewRecord> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: '80px' },
    { 
      title: 'NAME', 
      key: 'name', 
      render: (_, r) => <span className="font-medium text-gray-900">{r.firstName} {r.lastName}</span> 
    },
    { title: 'NATIONALITY', dataIndex: 'nationality', key: 'nationality' },
    { title: 'BIRTH DATE', dataIndex: 'birthDate', key: 'birthDate' },
    {
      title: 'ACTION',
      key: 'action',
      width: '100px',
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined 
            className="text-gray-400 hover:text-blue-600 cursor-pointer text-lg" 
            onClick={() => navigate(`/admin/crew/edit/${record.id}`)} 
          />
          <DeleteOutlined className="text-gray-400 hover:text-red-500 cursor-pointer text-lg" />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <ManagementHeader 
        title="Crew" 
        onAdd={() => navigate('/admin/crew/add')} 
        searchText={searchText}
        onSearchChange={setSearchText}
      />
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table 
          columns={columns} 
          dataSource={[]} // Add your data here
          pagination={{ 
            pageSize: 10,
            showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} results`
          }} 
          className="custom-admin-table"
        />
      </div>
    </div>
  );
}