import React, { useState, useEffect, useCallback } from "react"; // 💡 เพิ่ม React ตรงนี้
import { Table, Input, Button, message, Dropdown, Space, Modal } from "antd";
import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import { Trash2 } from "lucide-react";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import StatusBadge from "../../../components/admin/user/UserStatus";
import RoleBadge from "../../../components/admin/user/Role";

interface User {
  user_id: string;
  username: string;
  email: string;
  img_path: string | null;
  register_date: string;
  user_status: "active" | "suspended" | "banned";
  user_role: "admin" | "customer";
  country_name: string;
}

export default function Users() {
  const [dataSource, setDataSource] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
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
    } catch (error) {
      message.error("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  }, [
    pagination.current,
    pagination.pageSize,
    searchText,
    sortParams,
    filters,
  ]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    newFilters: Record<string, FilterValue | null>,
    sorter: SorterResult<User> | SorterResult<User>[],
  ) => {
    setPagination(newPagination);
    setFilters(newFilters);

    if (!Array.isArray(sorter)) {
      const nextOrder =
        sorter.order || (sortParams.order === "ascend" ? "descend" : "ascend");
      setSortParams({
        field: (sorter.field as string) || sortParams.field,
        order: nextOrder,
      });
    }
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    setDeleteModalOpen(true); // แค่เปิด modal
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: selectedRowKeys }),
      });
      const result = await response.json();
      if (response.ok) {
        message.success(result.message);
        setSelectedRowKeys([]);
        fetchUsers();
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error("Error deleting users");
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: User) => ({
      disabled: record.user_role?.toLowerCase() === "admin",
      name: record.username,
    }),
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      const resData = await response.json();
      if (response.ok) {
        message.success(resData.message);
        fetchUsers();
      } else {
        message.error(resData.message);
      }
    } catch (err) {
      message.error("Error updating status");
    }
  };

  const handleUpdateRole = async (id: string, newRole: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${id}/role`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        },
      );
      const resData = await response.json();
      if (response.ok) {
        message.success(resData.message);
        fetchUsers();
      } else {
        message.error(resData.message);
      }
    } catch (err) {
      message.error("Error updating role");
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: "User ID",
      dataIndex: "user_id",
      sorter: true,
      sortOrder:
        sortParams.field === "user_id" ? (sortParams.order as any) : null,
      sortDirections: ["ascend", "descend", "ascend"],
      width: 120,
    },
    {
      title: "Username",
      dataIndex: "username",
      sorter: true,
      sortOrder:
        sortParams.field === "username" ? (sortParams.order as any) : null,
      sortDirections: ["ascend", "descend", "ascend"],
      render: (text, record) => (
        <Space>
          <img
            src={record.img_path || "/default-avatar.png"}
            className="w-8 h-8 rounded-full border"
            alt="avatar"
          />
          <span className="font-medium text-gray-700">{text}</span>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
      sortOrder:
        sortParams.field === "email" ? (sortParams.order as any) : null,
      sortDirections: ["ascend", "descend", "ascend"],
    },
    { title: "Country", dataIndex: "country_name" },
    {
      title: "Role",
      dataIndex: "user_role",
      filters: [
        { text: "Admin", value: "admin" },
        { text: "Customer", value: "customer" },
      ],
      filterMultiple: false,
      filteredValue: filters.user_role || null,
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
      render: (status, record) => {
        const isAdmin = record.user_role?.toLowerCase() === "admin";
        return (
          <Dropdown
            disabled={isAdmin}
            menu={{
              items: [
                {
                  key: "active",
                  label: "Set Active",
                  disabled: status === "active",
                },
                {
                  key: "suspended",
                  label: "Suspend",
                  disabled: status === "suspended",
                },
                {
                  key: "banned",
                  label: "Ban User",
                  danger: true,
                  disabled: status === "banned",
                },
              ],
              onClick: ({ key }) => handleUpdateStatus(record.user_id, key),
            }}
            trigger={["click"]}
          >
            <div
              className={
                isAdmin ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              }
            >
              <StatusBadge status={status} />
            </div>
          </Dropdown>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: "view", label: "View Profile" },
              { key: "history", label: "Transaction History" },
            ],
          }}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div className="flex justify-between items-center gap-4 w-full">
          <Input
            placeholder="Search ID, Name, or Email..."
            prefix={<SearchOutlined className="text-gray-400" />}
            className="w-72 h-10 rounded-lg max-w-xl"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={() => {
              setPagination({ ...pagination, current: 1 });
              fetchUsers();
            }}
          />
          <Button
            danger
            type="primary"
            icon={<Trash2 size={18} />}
            disabled={selectedRowKeys.length === 0}
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            Delete {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
          </Button>
        </div>
      </div>

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
        className="border border-gray-100 rounded-lg overflow-hidden"
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
    </div>
  );
}
