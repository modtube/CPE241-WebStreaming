import { useState, useEffect } from 'react';
import { Table, Input, Button, message } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { Funnel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
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
  const [searchText, setSearchText] = useState('');
  const [dataSource, setDataSource] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // TODO: เปิดใช้งานเมื่อ Backend เสร็จแล้ว
      throw new Error('Trigger Mockup'); 
    } catch (error) {
      // 🚨 MOCKUP DATA ตามภาพ UI
      console.warn("Backend not found. Using Transactions Mockup Data instead.");
      setDataSource([
        { transaction_id: '001', name: 'Christopher Edward Nolan', release_date: '2026-01-16', amount: 123.45, payment_method: 'Credit / Debit Card', status: 'Completed' },
        { transaction_id: '002', name: 'Denis Villeneuve', release_date: '2026-01-16', amount: 30.90, payment_method: 'PromptPay/QR', status: 'Pending' },
        { transaction_id: '003', name: 'Bong Joon-ho', release_date: '2026-01-16', amount: 90.21, payment_method: 'Digital Wallet', status: 'Pending' },
        { transaction_id: '004', name: 'Hayao Miyazaki', release_date: '2026-01-16', amount: 829.23, payment_method: 'Digital Wallet', status: 'Cancelled' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleExportCSV = () => {
    // ใช้ filteredData (หลัง search) ไม่ใช่ dataSource ดิบ
    // user อาจกรองข้อมูลก่อนแล้วอยากได้แค่ที่กรอง
    const rows = filteredData;

    if (rows.length === 0) {
      message.warning('ไม่มีข้อมูลให้ export');
      return;
    }

    // กำหนด header ของ CSV (ตามลำดับ column ในตาราง)
    const headers = ['ID', 'Name', 'Release Date', 'Amount', 'Payment Method', 'Status'];

    // escape ค่าให้ปลอดภัย: ถ้ามี comma, quote, หรือ newline ต้องครอบด้วย " และ double-quote คู่
    const escape = (v: string | number) => {
      const s = String(v);
      if (/[",\n\r]/.test(s)) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    // สร้าง CSV content
    const csvLines = [
      headers.map(escape).join(','),
      ...rows.map((r) =>
        [
          r.transaction_id,
          r.name,
          r.release_date,
          r.amount.toFixed(2),
          r.payment_method,
          r.status,
        ]
          .map(escape)
          .join(',')
      ),
    ];

    // BOM ทำให้ Excel เปิดได้สวยพร้อม UTF-8 (ภาษาไทยไม่เพี้ยน)
    const csvContent = '\uFEFF' + csvLines.join('\n');

    // สร้าง blob และ trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    // ใส่วันที่ใน filename เพื่อแยก export แต่ละครั้ง
    const today = new Date().toISOString().slice(0, 10);
    link.download = `transactions_${today}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    message.success(`Export ${rows.length} transaction(s) สำเร็จ`);
  };

  // กำหนด Columns 
  const columns: ColumnsType<Transaction> = [
    { 
      title: 'ID', 
      dataIndex: 'transaction_id', 
      key: 'transaction_id', 
      width: '80px',
      sorter: (a, b) => a.transaction_id.localeCompare(b.transaction_id) 
    },
    { 
      title: 'NAME', 
      dataIndex: 'name', 
      key: 'name', 
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <span className="font-medium text-gray-800">{text}</span>
    },
    { 
      title: 'RELEASE DATE', 
      dataIndex: 'release_date', 
      key: 'release_date', 
      sorter: (a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime(),
      render: (text) => <span className="text-gray-500">{text}</span>
    },
    { 
      title: 'AMOUNT', 
      dataIndex: 'amount', 
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => <span className="text-gray-600">${amount.toFixed(2)}</span>
    },
    { 
      title: 'PAYMENT', 
      dataIndex: 'payment_method', 
      key: 'payment_method',
      filters: [
        { text: 'Credit / Debit Card', value: 'Credit / Debit Card' }, 
        { text: 'PromptPay/QR', value: 'PromptPay/QR' }, 
        { text: 'Digital Wallet', value: 'Digital Wallet' }
      ],
      onFilter: (value, record) => record.payment_method === value,
      filterIcon: (filtered) => <Funnel size={16} color={filtered ? '#3b82f6' : '#9ca3af'} strokeWidth={filtered ? 3 : 2} />,
      render: (text) => <span className="text-gray-600 font-medium">{text}</span>
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
      onFilter: (value, record) => record.status === value,
      filterIcon: (filtered) => <Funnel size={16} color={filtered ? '#3b82f6' : '#9ca3af'} strokeWidth={filtered ? 3 : 2} />,
      render: (status) => <TransactionStatus status={status} /> // 💡 แสดงป้ายเฉยๆ ไม่มี Dropdown ครอบแล้ว
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

  // ค้นหาด้วยชื่อ (Name)
  const filteredData = dataSource.filter((transaction) =>
    transaction.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-4">
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
        
        {/* เปลี่ยนปุ่มขวาบนเป็น Export CSV */}
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
        {/* เอา rowSelection ออก เพราะหน้านี้ไม่มี Checkbox ให้ลบ */}
        <Table 
          columns={columns} 
          dataSource={filteredData}
          loading={loading}
          rowKey="transaction_id"
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