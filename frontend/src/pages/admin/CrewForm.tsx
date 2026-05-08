import { Form, Input, Button, DatePicker, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export default function CrewForm() {
  const [form] = Form.useForm();

  return (
    <div className="p-4">
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 ">
        <h3 className="text-base font-semibold text-gray-900 mb-6">Person Detail</h3>
        
        <Form layout="vertical" form={form}>
          {/* Profile Image Section */}
          <div className="mb-8 ">
            <p className="text-xs font-semibold mb-2 uppercase tracking-wider">Image</p>
            <Upload listType="picture-card" showUploadList={false} className="avatar-uploader">
              <div className="flex flex-col items-center justify-center p-4">
                <PlusOutlined className="text-gray-400 text-2xl mb-2" />
                <span className="text-gray-400 text-[10px] font-bold tracking-widest">[ PROFILE IMAGE ]</span>
              </div>
            </Upload>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-semibold  ">
            <Form.Item label="FIRST NAME" name="firstName" rules={[{ required: true }]}>
              <Input placeholder="Name" className="h-10" />
            </Form.Item>
            <Form.Item label="MIDDLE NAME" name="middleName">
              <Input placeholder="Name" className="h-10" />
            </Form.Item>
            <Form.Item label="LAST NAME" name="lastName" rules={[{ required: true }]}>
              <Input placeholder="Name" className="h-10" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Form.Item label="BIRTH DATE" name="birthDate">
              <DatePicker className="w-full h-10" placeholder="Enter year..." />
            </Form.Item>
            <Form.Item label="BIRTH PLACE" name="birthPlace">
              <Input placeholder="Birth_place" className="h-10" />
            </Form.Item>
            <Form.Item label="NATIONALITY" name="nationality">
              <Input placeholder="Nationality" className="h-10" />
            </Form.Item>
          </div>

          <Form.Item label="BIOGRAPHY" name="biography">
            <Input.TextArea rows={6} placeholder="Enter text..." />
          </Form.Item>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
            <Button className="h-10 px-8 rounded-md font-medium">Cancel</Button>
            <Button type="primary" htmlType="submit" className="h-10 px-8 rounded-md bg-blue-600 font-medium">
              Create Person
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}