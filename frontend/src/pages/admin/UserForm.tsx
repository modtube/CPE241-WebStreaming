import { Form, Input, Button, Select } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

// กำหนด Grid สำหรับหน้า User
const userFields = [
  { label: 'Username', name: 'username', required: true, type: 'text', colSpan: 'col-span-1', placeholder: 'Enter username' },
  { label: 'Email', name: 'email', required: true, type: 'email', colSpan: 'col-span-1', placeholder: 'Enter email' },
  { label: 'Password', name: 'password', required: true, type: 'password', colSpan: 'col-span-1', placeholder: 'Enter password' },
  { label: 'Country', name: 'country', required: true, type: 'text', colSpan: 'col-span-1', placeholder: 'e.g. TH, US' },
];

export default function UsersForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    console.log("Submitting:", values);
    // TODO: ยิง API POST /api/users ที่นี่เหมือนหน้า Crew
    navigate('/admin/users');
  };

  return (
    <div className="p-4">      
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold mb-6 text-gray-800">User Detail</h3>
        
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* วนลูปสร้าง Input ธรรมดา */}
            {userFields.map((field) => (
              <Form.Item
                key={field.name}
                className={field.colSpan}
                label={<span className="uppercase text-xs font-bold text-gray-500 tracking-wider">{field.label}</span>}
                name={field.name}
                rules={[{ required: field.required, message: `${field.label} is required!` }]}
              >
                {field.type === 'password' ? (
                  <Input.Password placeholder={field.placeholder} className="h-10 rounded-md" />
                ) : (
                  <Input placeholder={field.placeholder} className="h-10 rounded-md" />
                )}
              </Form.Item>
            ))}

            {/* Dropdown สำหรับ Status */}
            <Form.Item
              className="col-span-1"
              label={<span className="uppercase text-xs font-bold text-gray-500 tracking-wider">Status</span>}
              name="status"
              rules={[{ required: true, message: 'Status is required!' }]}
              initialValue="Active"
            >
              <Select className="h-10">
                <Option value="Active">Active</Option>
                <Option value="Banned">Banned</Option>
                <Option value="Suspended">Suspended</Option>
              </Select>
            </Form.Item>

            {/* Dropdown สำหรับ Role */}
            <Form.Item
              className="col-span-1"
              label={<span className="uppercase text-xs font-bold text-gray-500 tracking-wider">Role</span>}
              name="role"
              rules={[{ required: true, message: 'Role is required!' }]}
              initialValue="Customer"
            >
              <Select className="h-10">
                <Option value="Admin">Admin</Option>
                <Option value="Customer">Customer</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-gray-100">
            <Button onClick={() => navigate('/admin/users')} className="h-10 px-8 rounded-md font-medium text-gray-600">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="h-10 px-8 rounded-md bg-blue-600 hover:bg-blue-700 font-medium shadow-md shadow-blue-600/20">
              Create User
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}