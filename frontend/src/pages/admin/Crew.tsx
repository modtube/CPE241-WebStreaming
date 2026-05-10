import { useState } from 'react';
import PageContainer from '../../components/common/PageContainer';
import { Table, Input, Button, Space, Form, DatePicker, Upload, message } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { RcFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';

interface CrewRecord {
  key: string;
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  nationality: string;
  birthDate: string;
  birthPlace: string;
  biography?: string;
  imageUrl?: string; 
}

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

export default function Crew() {
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [form] = Form.useForm();

  const [dataSource, setDataSource] = useState<CrewRecord[]>([]);

  const handleDelete = (idToDelete: string) => {
    const newData = dataSource.filter(item => item.id !== idToDelete);
    setDataSource(newData);
  };

  const handleGoToAdd = () => {
    setEditingId(null);
    setImageUrl(null);
    form.resetFields();
    setCurrentView('form');
  };

  const handleGoToEdit = (record: CrewRecord) => {
    setEditingId(record.id);
    setImageUrl(record.imageUrl || null);
    form.setFieldsValue({
      ...record,
      birthDate: dayjs(record.birthDate, 'YYYY-MM-DD'),
    });
    setCurrentView('form');
  };

  const handleBack = () => {
    setCurrentView('list');
    form.resetFields();
    setImageUrl(null);
    setEditingId(null);
  };

  const handleFormSubmit = (values: any) => {
    const formattedDate = values.birthDate.format('YYYY-MM-DD');

    if (editingId) {
      const updatedData = dataSource.map(item => 
        item.id === editingId 
          ? { ...item, ...values, birthDate: formattedDate, imageUrl: imageUrl } 
          : item
      );
      setDataSource(updatedData);
    } else {
      const numericIds = dataSource.map(item => parseInt(item.id.replace('C', ''), 10));
      const nextIdNumber = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
      const newIdString = `C${String(nextIdNumber).padStart(3, '0')}`;

      const newRecord: CrewRecord = {
        key: Date.now().toString(),
        id: newIdString,
        ...values,
        birthDate: formattedDate,
        imageUrl: imageUrl,
      };
      setDataSource([...dataSource, newRecord]);
    }
    handleBack();
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return Upload.LIST_IGNORE;
    }
    getBase64(file, (url) => setImageUrl(url));
    return false;
  };

  const columns: ColumnsType<CrewRecord> = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id', 
      width: '80px',
      sorter: (a, b) => a.id.localeCompare(b.id)
    },
    {
      title: 'NAME',
      key: 'name',
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
      render: (_, record) => (
        <div className="flex items-center gap-3">
          {record.imageUrl ? (
            <img src={record.imageUrl} alt="profile" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-semibold">
              {record.firstName[0]}
            </div>
          )}
          <span className="font-medium text-gray-900">
            {record.firstName} {record.middleName ? `${record.middleName} ` : ''}{record.lastName}
          </span>
        </div>
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
      dataIndex: 'birthDate', 
      key: 'birthDate',
      sorter: (a, b) => new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime()
    },
    { 
      title: 'BIRTH PLACE', 
      dataIndex: 'birthPlace', 
      key: 'birthPlace',
      sorter: (a, b) => a.birthPlace.localeCompare(b.birthPlace)
    },
    {
      title: 'ACTION',
      key: 'action',
      width: '100px',
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined 
            className="text-gray-400 hover:text-blue-600 cursor-pointer text-lg transition-colors"
            onClick={() => handleGoToEdit(record)}
          />
          <DeleteOutlined 
            className="text-gray-400 hover:text-red-500 cursor-pointer text-lg transition-colors"
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      
      {currentView === 'list' && (
        <div className="p-4">
          {/* ส่วน Search และ Add - แยกชิดซ้ายขวาตาม figma */}
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
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleGoToAdd}
              className="bg-blue-600 hover:bg-blue-700 h-10 px-6 rounded-lg flex items-center font-medium"
            >
              Add Cast or Crew
            </Button>
          </div>

          {/* กรอบ Table*/}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={{ 
                pageSize: 4, 
                showTotal: (total, range) => (
                  <span className="text-gray-400 font-normal">
                    Showing {range[0]} to {range[1]} of {total} results
                  </span>
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
                
                /* ย้ายไอคอน Sort มาไว้ข้างหน้า */
                [&_.ant-table-column-sorters]:flex-row-reverse 
                [&_.ant-table-column-sorter]:mr-2
                
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
      )}

      {currentView === 'form' && (
        <div className="bg-transparent">
          <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined className="text-gray-600 text-lg" />} 
              onClick={handleBack}
              className="hover:bg-gray-100 font-medium text-gray-600"
            >
              Back
            </Button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
            <h3 className="text-base font-semibold text-gray-900 mb-6">Person Detail</h3>

            <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
              <div className="mb-8">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Image</p>
                <Upload
                  name="avatar"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  accept="image/png, image/jpeg"
                >
                  {imageUrl ? (
                    <div className="w-64 h-64 border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                      <img src={imageUrl} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-64 h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                      <PlusOutlined className="text-gray-400 text-3xl mb-2" />
                      <span className="text-gray-400 font-medium tracking-widest">[ PROFILE IMAGE ]</span>
                    </div>
                  )}
                </Upload>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                <Form.Item label={<span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">First Name</span>} name="firstName" rules={[{ required: true, message: 'Required!' }]}>
                  <Input placeholder="Name" className="rounded-md h-10" />
                </Form.Item>
                <Form.Item label={<span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Middle Name</span>} name="middleName">
                  <Input placeholder="Name" className="rounded-md h-10" />
                </Form.Item>
                <Form.Item label={<span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Name</span>} name="lastName" rules={[{ required: true, message: 'Required!' }]}>
                  <Input placeholder="Name" className="rounded-md h-10" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                <Form.Item label={<span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Birth_Date</span>} name="birthDate" rules={[{ required: true, message: 'Required!' }]}>
                  <DatePicker className="w-full rounded-md h-10" placeholder="Enter year..." format="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item label={<span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Birth_Place</span>} name="birthPlace" rules={[{ required: true, message: 'Required!' }]}>
                  <Input placeholder="Birth_place" className="rounded-md h-10" />
                </Form.Item>
                <Form.Item label={<span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nationality</span>} name="nationality" rules={[{ required: true, message: 'Required!' }]}>
                  <Input placeholder="Nationality" className="rounded-md h-10" />
                </Form.Item>
              </div>

              <div className="mb-8">
                <Form.Item label={<span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Biography</span>} name="biography">
                  <Input.TextArea placeholder="Enter text..." rows={6} className="rounded-md" />
                </Form.Item>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                <Button onClick={handleBack} className="h-10 px-6 rounded-md text-gray-600 font-medium">
                  Back
                </Button>
                <Button type="primary" htmlType="submit" className="h-10 px-6 rounded-md bg-blue-600 hover:bg-blue-700 font-medium">
                  {editingId ? 'Update Person' : 'Create Person'}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}