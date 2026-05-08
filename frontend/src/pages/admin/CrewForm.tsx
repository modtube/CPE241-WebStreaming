import { Form, Input, Button, DatePicker, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// เพิ่ม property 'colSpan' เพื่อกำหนดความกว้างใน Grid
const personFields = [
  { label: 'First Name', name: 'first_name', required: true, type: 'text', colSpan: 'col-span-1' },
  { label: 'Middle Name', name: 'middle_name', required: false, type: 'text', colSpan: 'col-span-1' },
  { label: 'Last Name', name: 'last_name', required: true, type: 'text', colSpan: 'col-span-1' },
  { label: 'Birth Date', name: 'birth_date', required: true, type: 'date', colSpan: 'col-span-1' },
  { label: 'Birth Place', name: 'birth_place', required: true, type: 'text', colSpan: 'col-span-1' },
  { label: 'Nationality', name: 'nationality', required: true, type: 'text', colSpan: 'col-span-1' },
  // Biography ให้เต็ม 3 Column
  { label: 'Biography', name: 'biography', required: false, type: 'textarea', colSpan: 'lg:col-span-3' },
];

export default function CrewForm() {
  const [form] = Form.useForm();

  return (
    <div className="p-4">      
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold mb-6 text-gray-800">Person Detail</h3>
        
        <Form layout="vertical" form={form} onFinish={(values) => console.log(values)}>
          
          {/* ส่วนของรูปภาพ - ปรับให้ใหญ่และมีสไตล์ตาม UI */}
          <div className="mb-10 block w-full"> 
            <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Image</p>
            
            <Form.Item 
              name="img_path" 
              valuePropName="fileList" 
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              className="mb-0" // ลด margin ของ item เพื่อไม่ให้ห่างเกินไป
            >
              <Upload 
                showUploadList={false}
                className="w-full [&>.ant-upload]:w-full [&>.ant-upload]:block" // บังคับให้เป็น Block เพื่อไม่ให้ไปทับใคร
              >
                <div className="flex flex-col items-center justify-center w-full max-w-[300px] h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
                  <PlusOutlined className="text-gray-400 text-3xl mb-2" />
                  <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase">
                    [ Profile Image ]
                  </span>
                </div>
              </Upload>
            </Form.Item>
          </div>

          {/* Grid สำหรับ Input ต่างๆ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personFields.map((field) => (
              <Form.Item
                key={field.name}
                // ใส่ col-span ตามที่กำหนดไว้ใน Array
                className={field.colSpan}
                label={<span className="uppercase text-xs font-bold text-gray-500 tracking-wider">{field.label}</span>}
                name={field.name}
                rules={[{ required: field.required, message: `${field.label} is required!` }]}
              >
                {field.type === 'date' ? (
                  <DatePicker className="w-full h-10 rounded-md" placeholder="Enter year..." />
                ) : field.type === 'textarea' ? (
                  <Input.TextArea 
                    rows={6} 
                    placeholder="Enter text..." 
                    className="rounded-md p-3" 
                  />
                ) : (
                  <Input placeholder="Name" className="h-10 rounded-md" />
                )}
              </Form.Item>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-gray-100">
            <Button className="h-10 px-8 rounded-md font-medium text-gray-600">Cancel</Button>
            <Button type="primary" htmlType="submit" className="h-10 px-8 rounded-md bg-blue-600 hover:bg-blue-700 font-medium shadow-md shadow-blue-600/20">
              Create Person
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}