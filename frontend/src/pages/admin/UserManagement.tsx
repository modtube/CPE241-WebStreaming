import { useState } from 'react';
import { Table, Tag, Modal, message } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import ManagementHeader from '../../components/admin/ManagementHeader';

const { confirm } = Modal;

export default function UserManagement() {
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // ข้อมูลสมมติ (Mock Data)
  const dataSource = [
    { key: '001', id: '001', username: 'somchai_t', email: 'somchai@example.com', country: 'TH', status: 'Active', role: 'Admin' },
    { key: '003', id: '003', username: 'malee_c', email: 'malee@example.com', country: 'TH', status: 'Banned', role: 'Customer' },
    // เพิ่มข้อมูลอื่นๆ ตามต้องการ...
  ];

  // ฟังก์ชันแสดงหน้าต่างยืนยัน (Confirmation Modal)
  const showDeleteConfirm = () => {
    confirm({
      title: `Do you want to delete these ${selectedRowKeys.length} users?`,
      icon: <ExclamationCircleFilled />,
      content: 'This action cannot be undone. (ลบแล้วกู้คืนไม่ได้นะคับ)',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        // Logic สำหรับลบข้อมูลใน DB จริงๆ จะใส่ตรงนี้คับ
        console.log('Deleted keys:', selectedRowKeys);
        message.success(`Successfully deleted ${selectedRowKeys.length} users`);
        setSelectedRowKeys([]); // ล้างค่าที่เลือกไว้
      },
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', sorter: true },
    { title: 'USERNAME', dataIndex: 'username', key: 'username', sorter: true },
    { title: 'EMAIL', dataIndex: 'email', key: 'email' },
    { title: 'COUNTRY', dataIndex: 'country', key: 'country' },
    { 
      title: 'STATUS', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        let color = status === 'Active' ? 'green' : status === 'Banned' ? 'default' : 'red';
        return <Tag color={color} className="rounded-full px-3">{status}</Tag>;
      }
    },
    { 
      title: 'ROLE', 
      dataIndex: 'role', 
      key: 'role',
      render: (role: string) => (
        <span className={role === 'Admin' ? 'text-blue-600 font-bold' : 'text-gray-400'}>{role}</span>
      )
    },
  ];

  return (
    <div className="p-4">
      <ManagementHeader 
        title="User" 
        searchText={searchText}
        onSearchChange={setSearchText}
        // ส่งค่าการเลือกไปที่ Header
        selectedCount={selectedRowKeys.length}
        onDelete={showDeleteConfirm}
      />
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table 
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          columns={columns} 
          dataSource={dataSource}
          className="custom-admin-table"
        />
      </div>
    </div>
  );
}