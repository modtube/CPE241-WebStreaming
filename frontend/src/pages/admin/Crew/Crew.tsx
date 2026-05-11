import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Space, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ManagementHeader from '../../../components/admin/ManagementHeader';

interface Person {
  person_id: string;
  img_path: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  nationality: string;
  birth_date: string;
  birth_place: string;
  biography?: string;
  create_date: string;
  update_date: string;
}

export default function Crew() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [dataSource, setDataSource] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);

 const fetchCrew = async (search: string = '') => {
    setLoading(true);
    try {
      // ส่ง query string ไปที่ backend
      const response = await fetch(`http://localhost:5000/api/crew?search=${search}`);
      if (!response.ok) throw new Error('Fetch failed');
      const result = await response.json();
      setDataSource(result.data || result);
    } catch (error) {
      console.error("Fetch Error:", error);
      // กรณี Error หรือหา Backend ไม่เจอ สามารถใส่ Mockup ไว้กันพังได้เหมือนเดิมครับ
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrew(searchText);
  }, [searchText]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/crew/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        message.success('Deleted successfully');
        fetchCrew(); // เรียกดึงข้อมูลใหม่หลังจากลบสำเร็จ
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete');
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  // 2. ตั้งค่า Columns ให้ครบและใส่ Sorter (การเรียงลำดับ)
  const columns: ColumnsType<Person> = [
    { 
      title: 'ID', 
      dataIndex: 'person_id', 
      key: 'person_id', 
      width: '80px',
      sorter: (a, b) => a.person_id.localeCompare(b.person_id) 
    },
    {
      title: 'NAME',
      key: 'name',
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
      render: (_, record: Person) => ( // แก้ Error '_' โดยใส่ Type Person ตรงนี้คับ
        <span className="font-medium text-gray-900">
          {record.first_name} {record.middle_name ? `${record.middle_name} ` : ''}{record.last_name}
        </span>
      ),
    },
    { 
      title: 'NATIONALITY', 
      dataIndex: 'nationality', 
      key: 'nationality',
      sorter: (a, b) => a.nationality.localeCompare(b.nationality)
    },
    { 
      title: 'BIRTH DATE', 
      dataIndex: 'birth_date', 
      key: 'birth_date',
      sorter: (a, b) => new Date(a.birth_date).getTime() - new Date(b.birth_date).getTime()
    },
    { 
      title: 'BIRTH PLACE', 
      dataIndex: 'birth_place', 
      key: 'birth_place',
      sorter: (a, b) => a.birth_place.localeCompare(b.birth_place)
    },
    { 
      title: 'CREATE DATE', 
      dataIndex: 'create_date', 
      key: 'create_date',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.create_date).getTime() - new Date(b.create_date).getTime()
    },
    {
      title: 'ACTION',
      key: 'action',
      width: '100px',
      render: (_, record: Person) => (
        <Space size="middle">
          <EditOutlined 
            className="text-gray-400 hover:text-blue-600 cursor-pointer text-lg" 
            onClick={() => navigate(`/admin/crew/edit/${record.person_id}`)} 
          />
          {/* 2. หุ้ม DeleteOutlined ด้วย Popconfirm เพื่อความปลอดภัย */}
          <Popconfirm
            title="Delete this person?"
            description="Are you sure you want to delete this crew member?"
            onConfirm={() => handleDelete(record.person_id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <DeleteOutlined className="text-gray-400 hover:text-red-500 cursor-pointer text-lg" />
          </Popconfirm>
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
        searchPlaceholder="Search by ID, Name..." 
      />
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table 
          columns={columns} 
          dataSource={dataSource}
          loading={loading}
          rowKey="person_id"
          pagination={{ 
            pageSize: 20,
            showTotal: (total, range) => (
              <span className="text-gray-400">Showing {range[0]} to {range[1]} of {total} results</span>
            )
          }}

          className="
            [&_.ant-table-thead_th]:bg-white
            [&_.ant-table-thead_th]:text-gray-400
            [&_.ant-table-thead_th]:text-[13px]
            [&_.ant-table-thead_th]:font-semibold
            
            /* ย้ายสัญลักษณ์ Sort มาไว้ซ้ายสุดของ Header Text */
            [&_.ant-table-column-sorters]:flex-row-reverse 
            [&_.ant-table-column-sorter]:mr-2
          "
        />
      </div>
    </div>
  );
}