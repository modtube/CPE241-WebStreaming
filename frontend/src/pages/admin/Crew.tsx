import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ManagementHeader from '../../components/admin/ManagementHeader';

// 1. กำหนด Interface ให้ตรงกับ SQL Schema ของคุณ
interface Person {
  person_id: number;
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

 const fetchCrew = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/crew');
      if (!response.ok) throw new Error('Fetch failed');
      const data = await response.json();
      setDataSource(data);
    } catch (error) {
      // 🚨 MOCKUP DATA: ส่วนนี้จะทำงานเมื่อหา Backend ไม่เจอ (คอมเมนต์ทิ้งได้เลยเมื่อเชื่อม API จริงเสร็จ)
      console.warn("Backend not found. Using Crew Mockup Data instead.");
      setDataSource([
        {
          person_id: 1,
          img_path: 'https://example.com/nolan.jpg',
          first_name: 'Christopher',
          last_name: 'Nolan',
          nationality: 'British-American',
          birth_date: '1970-07-30',
          birth_place: 'London, England',
          biography: 'Known for making complex blockbusters.',
          create_date: '2026-05-09T10:00:00Z',
          update_date: '2026-05-09T10:00:00Z'
        },
        {
          person_id: 2,
          img_path: 'https://example.com/cillian.jpg',
          first_name: 'Cillian',
          last_name: 'Murphy',
          nationality: 'Irish',
          birth_date: '1976-05-25',
          birth_place: 'Cork, Ireland',
          biography: 'Frequent collaborator with Christopher Nolan.',
          create_date: '2026-05-09T10:15:00Z',
          update_date: '2026-05-09T10:15:00Z'
        },
        {
          person_id: 3,
          img_path: 'https://example.com/robert.jpg',
          first_name: 'Robert',
          middle_name: 'John',
          last_name: 'Downey Jr.',
          nationality: 'American',
          birth_date: '1965-04-04',
          birth_place: 'New York, USA',
          biography: 'Academy Award-winning actor.',
          create_date: '2026-05-09T10:30:00Z',
          update_date: '2026-05-09T10:30:00Z'
        },
        {
          person_id: 4,
          img_path: 'https://example.com/hans.jpg',
          first_name: 'Hans',
          last_name: 'Zimmer',
          nationality: 'German',
          birth_date: '1957-09-12',
          birth_place: 'Frankfurt, Germany',
          biography: 'Legendary film score composer.',
          create_date: '2026-05-09T10:45:00Z',
          update_date: '2026-05-09T10:45:00Z'
        }
      ]);
      // message.error('Failed to load crew data'); // ปิดแจ้งเตือน Error สีแดงไว้ชั่วคราว
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrew();
  }, []);

  // 2. ตั้งค่า Columns ให้ครบและใส่ Sorter (การเรียงลำดับ)
  const columns: ColumnsType<Person> = [
    { 
      title: 'ID', 
      dataIndex: 'person_id', 
      key: 'person_id', 
      width: '80px',
      sorter: (a, b) => a.person_id - b.person_id 
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