import { useState, useEffect } from 'react';
import { Table, Input, Button, message, Dropdown } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Funnel } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd'; 
import StatusBadge from '../../components/admin/Status';
import RoleBadge from '../../components/admin/Role';

interface User {
  user_id: string; 
  username: string;
  email: string;
  country: string;
  status: 'Active' | 'Banned' | 'Suspended';
  role: 'Admin' | 'Customer';
}

export default function Users() {
  const [searchText, setSearchText] = useState('');
  const [dataSource, setDataSource] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]); 

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // TODO: เปิดใช้งานเมื่อ Backend เสร็จแล้ว
      const response = await fetch('http://localhost:5000/api/users'); 
      if (!response.ok) throw new Error('Fetch failed');
      const data = await response.json();
      setDataSource(data);
    } catch (error) {
      // 🚨 MOCKUP DATA: ส่วนนี้จะทำงานเมื่อหา Backend ไม่เจอ (คอมเมนต์ทิ้งได้เลยเมื่อเชื่อม API จริงเสร็จ)
      console.warn("Backend not found. Using Users Mockup Data instead.");
      setDataSource([
        { user_id: '001', username: 'somchai_t', email: 'somchai@example.com', country: 'TH', status: 'Active', role: 'Admin' },
        { user_id: '002', username: 'nattapong_s', email: 'nattapong@example.com', country: 'TH', status: 'Active', role: 'Customer' },
        { user_id: '003', username: 'malee_c', email: 'malee@example.com', country: 'TH', status: 'Banned', role: 'Customer' },
        { user_id: '004', username: 'john_smith', email: 'john.smith@example.com', country: 'US', status: 'Active', role: 'Customer' },
        { user_id: '005', username: 'emily_jones', email: 'emily.j@example.com', country: 'US', status: 'Suspended', role: 'Customer' },
      ]);
      // message.error('Failed to load users data'); // ปิดแจ้งเตือน Error สีแดงไว้ชั่วคราว
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // ฟังก์ชันอัปเดต Status (ยิง API ไปหลังบ้าน)
  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      // TODO: เปิดคอมเมนต์โค้ดด้านล่างเมื่อต่อ Backend เสร็จแล้ว
      /*
      const response = await fetch(`http://localhost:5000/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Update failed');
      */
      
      // อัปเดตข้อมูลบนหน้าจอทันที (เพื่อให้เห็นผลลัพธ์ระหว่างใช้ Mockup)
      setDataSource(prevData => 
        prevData.map(user => user.user_id === userId ? { ...user, status: newStatus as any } : user)
      );
      message.success(`Status updated to ${newStatus}`);
    } catch (error) {
      message.error('Failed to update status');
    }
  };

  // ฟังก์ชันอัปเดต Role (ยิง API ไปหลังบ้าน)
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      // TODO: เปิดคอมเมนต์โค้ดเมื่อต่อ Backend เสร็จแล้ว
      /*
      const response = await fetch(`http://localhost:5000/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (!response.ok) throw new Error('Update failed');
      */
      
      setDataSource(prevData => 
        prevData.map(user => user.user_id === userId ? { ...user, role: newRole as any } : user)
      );
      message.success(`Role updated to ${newRole}`);
    } catch (error) {
      message.error('Failed to update role');
    }
  };

  // กำหนด Columns 
  const columns: ColumnsType<User> = [
    { 
      title: 'ID', 
      dataIndex: 'user_id', 
      key: 'user_id', 
      width: '80px',
      sorter: (a, b) => a.user_id.localeCompare(b.user_id) 
    },
    {
      title: 'USERNAME',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
      render: (text) => <span className="font-bold text-gray-800">{text}</span>,
    },
    { 
      title: 'EMAIL', 
      dataIndex: 'email', 
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      render: (text) => <span className="text-gray-500">{text}</span>
    },
    { 
      title: 'COUNTRY', 
      dataIndex: 'country', 
      key: 'country',
      filters: [{ text: 'TH', value: 'TH' }, { text: 'US', value: 'US' }],
      onFilter: (value, record) => record.country === value,
      filterIcon: (filtered) => (
      <Funnel 
        size={16} 
        color={filtered ? '#3b82f6' : '#9ca3af'} 
        strokeWidth={filtered ? 3 : 2} 
      />
    ),
      render: (text) => <span className="text-gray-500">{text}</span>
    },
    { 
      title: 'STATUS', 
      dataIndex: 'status', 
      key: 'status',
      filters: [
        { text: 'Active', value: 'Active' }, 
        { text: 'Banned', value: 'Banned' },
        { text: 'Suspended', value: 'Suspended' }
      ],
      onFilter: (value, record) => record.status === value,
      filterIcon: (filtered) => (
      <Funnel 
        size={16} 
        color={filtered ? '#3b82f6' : '#9ca3af'} 
        strokeWidth={filtered ? 3 : 2} 
      />
      ),
      render: (status, record) => {
        const items: MenuProps['items'] = [
          { key: 'Active', label: 'Active' },
          { key: 'Banned', label: 'Banned' },
          { key: 'Suspended', label: 'Suspended' },
        ];
        return (
          <Dropdown 
            menu={{ items, onClick: ({ key }) => handleStatusChange(record.user_id, key) }} 
            trigger={['click']}
          >
            <div className="cursor-pointer hover:opacity-80 transition-opacity inline-block" title="Click to change status">
              <StatusBadge status={status} />
            </div>
          </Dropdown>
        );
      }
    },
    { 
      title: 'ROLE', 
      dataIndex: 'role', 
      key: 'role',
      filters: [{ text: 'Admin', value: 'Admin' }, { text: 'Customer', value: 'Customer' }],
      onFilter: (value, record) => record.role === value,
      filterIcon: (filtered) => (
      <Funnel 
        size={16} 
        color={filtered ? '#3b82f6' : '#9ca3af'} 
        strokeWidth={filtered ? 3 : 2} 
      />
      ),
      render: (role, record) => {
        const items: MenuProps['items'] = [
          { key: 'Admin', label: 'Admin' },
          { key: 'Customer', label: 'Customer' },
        ];
        return (
          <Dropdown 
            menu={{ items, onClick: ({ key }) => handleRoleChange(record.user_id, key) }} 
            trigger={['click']}
          >
            <div className="cursor-pointer hover:opacity-80 transition-opacity inline-block" title="Click to change role">
              <RoleBadge role={role} />
            </div>
          </Dropdown>
        );
      }
    },
  ];

  return (
    <div className="p-4">
<<<<<<< Updated upstream
=======
      {/* ส่วน Header แยกซ้าย-ขวา */}
>>>>>>> Stashed changes
      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-md">
          <Input
            placeholder="Search by name..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="h-10 rounded-lg border-gray-300 shadow-sm"
          />
        </div>
        
        {/* ปุ่ม Delete จะมีสีแดง และแสดงจำนวนที่เลือก */}
        {selectedRowKeys.length > 0 && (
          <Button 
            danger 
            className="h-10 px-6 rounded-lg font-medium border-red-200 text-red-500 hover:bg-red-50"
            onClick={() => message.warning(`Deleting ${selectedRowKeys.length} users...`)}
          >
            Delete ({selectedRowKeys.length})
          </Button>
        )}
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table 
          rowSelection={rowSelection}
          columns={columns} 
          dataSource={dataSource}
          loading={loading}
          rowKey="user_id"
          pagination={{ 
            pageSize: 5,
            showTotal: (total, range) => (
              <span className="text-gray-400 font-normal">Showing {range[0]} to {range[1]} of {total} results</span>
            ),
            itemRender: (_, type, originalElement) => {
              if (type === 'prev') return <Button className="text-gray-600 rounded-md border-gray-200 px-4 h-9">Back</Button>;
              if (type === 'next') return <Button className="text-gray-600 rounded-md border-gray-200 px-4 h-9">Next</Button>;
              return originalElement;
            }
          }}
          className="
            [&_.ant-table-thead_th]:bg-white
            [&_.ant-table-thead_th]:border-b
            [&_.ant-table-thead_th]:text-[13px] 
            [&_.ant-table-thead_th]:text-gray-400
            [&_.ant-table-thead_th]:font-semibold 
            [&_.ant-table-thead_th]:py-5
            [&_.ant-table-row_td]:py-5
            
<<<<<<< Updated upstream
            [&_.ant-table-column-sorters]:flex-row-reverse 
            [&_.ant-table-column-sorters]:gap-2
            
=======
            /* 1. ย้ายสัญลักษณ์ Sort มาไว้ซ้ายสุด และใช้ gap จัดระยะห่าง */
            [&_.ant-table-column-sorters]:flex-row-reverse 
            [&_.ant-table-column-sorters]:gap-2
            
            /* 2. ย้ายสัญลักษณ์ Filter มาไว้ซ้ายสุด และใช้ gap จัดระยะห่าง */
>>>>>>> Stashed changes
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