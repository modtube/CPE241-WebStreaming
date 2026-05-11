<<<<<<< Updated upstream
import { useState, useEffect } from 'react';
import { Table, Input, Button, message, Dropdown } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Funnel } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd'; 
import StatusBadge from '../../../components/admin/user/UserStatus';
import RoleBadge from '../../../components/admin/user/Role';
=======
import React, { useState, useEffect, useCallback } from "react";
import { Table, Input, Button, message, Dropdown, Space, Modal } from "antd";
import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import { Trash2, Funnel } from "lucide-react";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import StatusBadge from "../../../components/admin/user/UserStatus";
import RoleBadge from "../../../components/admin/user/Role";
>>>>>>> Stashed changes

interface User {
  user_id: string; 
  username: string;
  email: string;
<<<<<<< Updated upstream
  country: string;
  status: 'Active' | 'Banned' | 'Suspended';
  role: 'Admin' | 'Customer';
=======
  img_path: string | null;
  register_date: string;
  user_status: "active" | "suspended" | "banned";
  user_role: "admin" | "customer";
  country_code?: string;
}

interface Country {
  country_code: string;
  country_name: string;
>>>>>>> Stashed changes
}

export default function Users() {
  const [searchText, setSearchText] = useState('');
  const [dataSource, setDataSource] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
<<<<<<< Updated upstream
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]); 

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // TODO: เปิดใช้งานเมื่อ Backend เสร็จแล้ว
      const response = await fetch('http://localhost:5000/api/users'); 
      if (!response.ok) throw new Error('Fetch failed');
      const data = await response.json();
      setDataSource(data);
=======
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [sortParams, setSortParams] = useState<{
    field: string;
    order: string;
  }>({
    field: "user_id",
    order: "ascend",
  });

  const [filters, setFilters] = useState<Record<string, FilterValue | null>>(
    {},
  );

  const fetchCountries = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/countries");
      const result = await response.json();
      if (response.ok) {
        setCountries(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch countries", error);
    }
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: String(pagination.current),
        limit: String(pagination.pageSize),
        sort_by: sortParams.field,
        order: sortParams.order === "ascend" ? "ASC" : "DESC",
        ...(searchText && { search: searchText }),
        ...(filters.user_status?.[0] && {
          user_status: String(filters.user_status[0]),
        }),
        ...(filters.user_role?.[0] && {
          user_role: String(filters.user_role[0]),
        }),
        ...(filters.country_code?.[0] && {
          country_code: String(filters.country_code[0]),
        }),
      });

      const response = await fetch(`http://localhost:5000/api/users?${query}`);
      const result = await response.json();

      if (response.ok) {
        setDataSource(result.data);
        setPagination((prev) => ({
          ...prev,
          total: result.pagination.total_items,
        }));
      }
>>>>>>> Stashed changes
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
<<<<<<< Updated upstream
=======
  }, [fetchUsers]);

  useEffect(() => {
    fetchCountries();
>>>>>>> Stashed changes
  }, []);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // ฟังก์ชันอัปเดต Status
  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      /* TODO: เปิดคอมเมนต์เมื่อต่อ Backend เสร็จแล้ว
      const response = await fetch(`http://localhost:5000/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Update failed');
      */
      
      // อัปเดตข้อมูลบนหน้าจอทันที
      setDataSource(prevData => 
        prevData.map(user => user.user_id === userId ? { ...user, status: newStatus as User['status'] } : user)
      );
      message.success(`Status updated to ${newStatus}`);
    } catch (error) {
      message.error('Failed to update status');
    }
  };

  // ฟังก์ชันอัปเดต Role
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      /* TODO: เปิดคอมเมนต์เมื่อต่อ Backend เสร็จแล้ว
      const response = await fetch(`http://localhost:5000/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (!response.ok) throw new Error('Update failed');
      */
      
      // อัปเดตข้อมูลบนหน้าจอทันที
      setDataSource(prevData => 
        prevData.map(user => user.user_id === userId ? { ...user, role: newRole as User['role'] } : user)
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
<<<<<<< Updated upstream
    { 
      title: 'STATUS', 
      dataIndex: 'status', 
      key: 'status',
=======
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
      sortOrder:
        sortParams.field === "email" ? (sortParams.order as any) : null,
      sortDirections: ["ascend", "descend", "ascend"],
    },
    {
      title: "Country",
      dataIndex: "country_code",
      filters: countries.map((c) => ({
        text: c.country_name,
        value: c.country_code,
      })),
      filterMultiple: false,
      filteredValue: filters.country_code || null,
      filterIcon: (filtered) => (
        <Funnel
          size={16}
          color={filtered ? "#3b82f6" : "#9ca3af"}
          strokeWidth={filtered ? 3 : 2}
        />
      ),
      render: (_, record) => record.country_code || "-",
    },
    {
      title: "Role",
      dataIndex: "user_role",
>>>>>>> Stashed changes
      filters: [
        { text: 'Active', value: 'Active' }, 
        { text: 'Banned', value: 'Banned' },
        { text: 'Suspended', value: 'Suspended' }
      ],
<<<<<<< Updated upstream
      onFilter: (value, record) => record.status === value,
      filterIcon: (filtered) => (
        <Funnel 
          size={16} 
          color={filtered ? '#3b82f6' : '#9ca3af'} 
          strokeWidth={filtered ? 3 : 2} 
        />
      ),
=======
      filterMultiple: false,
      filteredValue: filters.user_role || null,
      filterIcon: (filtered) => (
        <Funnel
          size={16}
          color={filtered ? "#3b82f6" : "#9ca3af"}
          strokeWidth={filtered ? 3 : 2}
        />
      ),
      render: (role, record) => (
        <Dropdown
          disabled={role?.toLowerCase() === "admin"}
          menu={{
            items: [
              {
                key: "admin",
                label: "Make Admin",
                disabled: role?.toLowerCase() === "admin",
              },
              {
                key: "customer",
                label: "Make Customer",
                disabled: role?.toLowerCase() === "customer",
              },
            ],
            onClick: ({ key }) => handleUpdateRole(record.user_id, key),
          }}
          trigger={["click"]}
        >
          <div
            className={
              role?.toLowerCase() === "admin"
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer"
            }
          >
            <RoleBadge role={role} />
          </div>
        </Dropdown>
      ),
    },
    {
      title: "Status",
      dataIndex: "user_status",
      filters: [
        { text: "Active", value: "active" },
        { text: "Suspended", value: "suspended" },
        { text: "Banned", value: "banned" },
      ],
      filterMultiple: false,
      filteredValue: filters.user_status || null,
      filterIcon: (filtered) => (
        <Funnel
          size={16}
          color={filtered ? "#3b82f6" : "#9ca3af"}
          strokeWidth={filtered ? 3 : 2}
        />
      ),
>>>>>>> Stashed changes
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

  // 💡 สร้างตัวแปรมาเก็บข้อมูลที่ถูกกรองจากการค้นหา
  const filteredData = dataSource.filter((user) =>
    user.username.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* ส่วน Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-md">
          <Input
            placeholder="Search by username or email..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="h-10 rounded-lg border-gray-300 shadow-sm"
          />
        </div>
        
        {/* ปุ่ม Delete */}
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
          dataSource={filteredData}  
          loading={loading}
          rowKey="user_id"
          pagination={{ 
            pageSize: 5,
            showTotal: (total, range) => (
              <span className="text-gray-400 font-normal">Showing {range[0]} to {range[1]} of {total} results</span>
            )
            // 💡 ลบ itemRender เพื่อให้กลับไปใช้ปุ่ม Default (< 1 >) ของ Ant Design
          }}
          className="
            [&_.ant-table-thead_th]:bg-white
            [&_.ant-table-thead_th]:border-b
            [&_.ant-table-thead_th]:text-[13px] 
            [&_.ant-table-thead_th]:text-gray-400
            [&_.ant-table-thead_th]:font-semibold 
            [&_.ant-table-thead_th]:py-5
            [&_.ant-table-row_td]:py-5
            
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
<<<<<<< Updated upstream
=======

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey="user_id"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total} users`,
        }}
        onChange={handleTableChange}
        className="border border-gray-100 rounded-lg overflow-hidden [&_.ant-table-filter-column]:flex-row-reverse [&_.ant-table-filter-column]:justify-end [&_.ant-table-filter-column]:gap-2"
      />
      <Modal
        open={deleteModalOpen}
        title="Confirm Deletion"
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        onOk={confirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      >
        Are you sure you want to delete {selectedRowKeys.length} selected users?
        This action cannot be undone.
      </Modal>
>>>>>>> Stashed changes
    </div>
  );
}