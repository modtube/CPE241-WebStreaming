import React, { useState, useEffect, useCallback } from 'react';
import { Table, Input, Button, message } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { Funnel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import TransactionStatus from '../../../components/admin/transaction/TransactionStatus';

interface Transaction {
  transaction_id: string;
  name: string;
  release_date: string;
  amount: number;
  payment_method: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
}

export default function Transactions() {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  // State สำหรับ Server-side Pagination & Sorting
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10, 
    total: 0,
  });

  const [sortParams, setSortParams] = useState<{
    field: string;
    order: string;
  }>({
    field: 'transaction_id',
    order: 'ascend', 
  });

  const [filters, setFilters] = useState<Record<string, FilterValue | null>>({});

  // ฟังก์ชัน Fetch ข้อมูลจาก Backend (ทำงานแบบ Server-side)
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      // สร้าง Query String ส่งไปให้ Backend
      const query = new URLSearchParams({
        page: String(pagination.current),
        limit: String(pagination.pageSize),
        sort_by: sortParams.field,
        order: sortParams.order === "ascend" ? "ASC" : "DESC",
        ...(searchText && { search: searchText }),
        ...(filters.payment_method?.[0] && {
          payment_method: String(filters.payment_method[0]),
        }),
        ...(filters.status?.[0] && {
          status: String(filters.status[0]),
        }),
      });

      const response = await fetch(`http://localhost:5000/api/transactions?${query}`);
      const result = await response.json();

      if (response.ok) {
        // กรณี Backend ส่งข้อมูลมาเป็นโครงสร้าง { data: [...], pagination: {...} } 
        if (result.data) {
           setDataSource(result.data);
           setPagination((prev) => ({
             ...prev,
             total: result.pagination?.total_items || result.data.length,
           }));
        } else {
           // กรณี Backend ส่งข้อมูลกลับมาเป็น Array ตรงๆ (Fallback)
           setDataSource(result);
           setPagination((prev) => ({
             ...prev,
             total: result.length,
           }));
        }
      } else {
        throw new Error(result.message || 'Fetch failed');
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      message.error("ไม่สามารถดึงข้อมูล Transactions ได้");
      setDataSource([]);
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
    fetchTransactions();
  }, [fetchTransactions]);

  // จับ Event เวลากดเปลี่ยนหน้า หรือ กดเรียงลำดับในตาราง
  const handleTableChange = (
    newPagination: TablePaginationConfig,
    newFilters: Record<string, FilterValue | null>,
    sorter: SorterResult<Transaction> | SorterResult<Transaction>[],
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

  const handleExportCSV = () => {
    // TODO: เขียน Logic สำหรับดาวน์โหลดไฟล์ CSV
    message.success('Exporting transactions to CSV...');

    if (rows.length === 0) {
      message.warning('ไม่มีข้อมูลให้ export');
      return;
    }

    const headers = ['ID', 'Name', 'Release Date', 'Amount', 'Payment Method', 'Status'];

    const escape = (v: string | number | null | undefined) => {
      if (v === null || v === undefined) return ''; 
      const s = String(v);
      if (/[",\n\r]/.test(s)) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    const csvLines = [
      headers.map(escape).join(','),
      ...rows.map((r) =>
        [
          r.transaction_id,
          r.name,
          r.release_date,
          r.amount ? Number(r.amount).toFixed(2) : '0.00', 
          r.payment_method,
          r.status,
        ]
          .map(escape)
          .join(',')
      ),
    ];

    const csvContent = '\uFEFF' + csvLines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    const today = new Date().toISOString().slice(0, 10);
    link.download = `transactions_${today}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    message.success(`Export ${rows.length} transaction(s) สำเร็จ`);
  };

  const columns: ColumnsType<Transaction> = [
    { 
      title: 'ID', 
      dataIndex: 'transaction_id', 
      key: 'transaction_id', 
      width: '80px',
      sorter: true, // 💡 เปิด Sorter Server-side
      sortOrder: sortParams.field === "transaction_id" ? (sortParams.order as any) : null,
      sortDirections: ["ascend", "descend", "ascend"],
    },
    { 
      title: 'NAME', 
      dataIndex: 'name', 
      key: 'name', 
      sorter: true,
      sortOrder: sortParams.field === "name" ? (sortParams.order as any) : null,
      sortDirections: ["ascend", "descend", "ascend"],
      render: (text) => <span className="font-medium text-gray-800">{text || '-'}</span>
    },
    { 
      title: 'RELEASE DATE', 
      dataIndex: 'release_date', 
      key: 'release_date', 
      sorter: true,
      sortOrder: sortParams.field === "release_date" ? (sortParams.order as any) : null,
      sortDirections: ["ascend", "descend", "ascend"],
      render: (text) => <span className="text-gray-500">{text || '-'}</span>
    },
    { 
      title: 'AMOUNT', 
      dataIndex: 'amount', 
      key: 'amount',
      sorter: true,
      sortOrder: sortParams.field === "amount" ? (sortParams.order as any) : null,
      sortDirections: ["ascend", "descend", "ascend"],
      render: (amount) => <span className="text-gray-600">${amount ? Number(amount).toFixed(2) : '0.00'}</span>
    },
    { 
      title: 'PAYMENT', 
      dataIndex: 'payment_method', 
      key: 'payment_method',
      filters: [
        { text: 'Credit Card', value: 'credit_card' },
        { text: 'Debit Card', value: 'debit_card' },
        { text: 'PayPal', value: 'paypal' },
        { text: 'Bank Transfer', value: 'bank_transfer' },
      ],
            filterMultiple: false, 
      filteredValue: filters.payment_method || null,
      filterIcon: (filtered) => <Funnel size={16} color={filtered ? '#3b82f6' : '#9ca3af'} strokeWidth={filtered ? 3 : 2} />,
      render: (text) => <span className="text-gray-600 font-medium">{text || '-'}</span>
    },
    { 
      title: 'STATUS', 
      dataIndex: 'status', 
      key: 'status',
      filters: [
        { text: 'Completed', value: 'Completed' }, 
        { text: 'Pending', value: 'Pending' }, 
        { text: 'Cancelled', value: 'Cancelled' }
      ],
      filterMultiple: false,
      filteredValue: filters.status || null,
      filterIcon: (filtered) => <Funnel size={16} color={filtered ? '#3b82f6' : '#9ca3af'} strokeWidth={filtered ? 3 : 2} />,
      render: (status) => <TransactionStatus status={status} /> 
    },
    {
      title: 'ACTION',
      key: 'action',
      render: (_, record) => (
        <span 
          className="text-blue-600 font-semibold cursor-pointer hover:text-blue-800 transition-colors"
          onClick={() => navigate(`/admin/transactions/${record.transaction_id}`)}
        >
          View Detail
        </span>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-md">
          <Input
            placeholder="Search by ID, Name..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={() => {
              setPagination({ ...pagination, current: 1 }); 
              fetchTransactions();
            }}
            className="h-10 rounded-lg border-gray-300 shadow-sm"
          />
        </div>
        
        <Button 
          type="primary" 
          icon={<DownloadOutlined />} 
          className="h-10 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium shadow-md shadow-blue-600/20"
          onClick={handleExportCSV}
        >
          Export CSV
        </Button>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
        <Table 
          columns={columns} 
          dataSource={dataSource}
          loading={loading}
          rowKey="transaction_id"
          pagination={{ 
            ...pagination,
            showSizeChanger: true,
            showTotal: (total, range) => <span className="text-gray-400 font-normal">Showing {range[0]} to {range[1]} of {total} results</span>
          }}
          onChange={handleTableChange}
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