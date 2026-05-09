import { Form, Input, Button, Select, DatePicker, InputNumber, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { TextArea } = Input;

export default function MovieForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    console.log("Submitting Movie:", values);
    // TODO: ยิง API POST /api/movies 
    navigate('/admin/movies');
  };

  return (
    <div className="p-4">      
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 max-w-5xl mx-auto">
        <h3 className="text-lg font-bold mb-6 text-gray-800">Movie Detail</h3>
        
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* ซ้าย: อัปโหลดรูปภาพ */}
            <div className="col-span-1">
              <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Poster Image</p>
              <Form.Item name="img_path" valuePropName="fileList" getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}>
                <Upload showUploadList={false} className="w-full [&>.ant-upload]:w-full [&>.ant-upload]:block">
                  <div className="flex flex-col items-center justify-center w-full aspect-[2/3] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
                    <PlusOutlined className="text-gray-400 text-3xl mb-2" />
                    <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase">
                      [ Upload Poster ]
                    </span>
                  </div>
                </Upload>
              </Form.Item>
            </div>

            {/* ขวา: ช่องกรอกข้อมูล */}
            <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              <Form.Item name="title" label={<span className="uppercase text-xs font-bold text-gray-500">Title</span>} rules={[{ required: true }]} className="col-span-1 md:col-span-2">
                <Input placeholder="Enter movie title" className="h-10 rounded-md" />
              </Form.Item>

              <Form.Item name="release_date" label={<span className="uppercase text-xs font-bold text-gray-500">Release Date</span>} rules={[{ required: true }]}>
                <DatePicker className="w-full h-10 rounded-md" />
              </Form.Item>

              <Form.Item name="price" label={<span className="uppercase text-xs font-bold text-gray-500">Price ($)</span>} rules={[{ required: true }]}>
                <InputNumber className="w-full h-10 rounded-md" placeholder="e.g. 299.00" min={0} precision={2} />
              </Form.Item>

              <Form.Item name="rating" label={<span className="uppercase text-xs font-bold text-gray-500">Rating</span>} rules={[{ required: true }]}>
                <Select className="h-10" placeholder="Select rating">
                  <Option value="NR">NR</Option>
                  <Option value="G">G</Option>
                  <Option value="PG-13">PG-13</Option>
                  <Option value="R">R</Option>
                </Select>
              </Form.Item>

              <Form.Item name="country" label={<span className="uppercase text-xs font-bold text-gray-500">Country</span>} rules={[{ required: true }]}>
                <Input placeholder="e.g. US, TH, JP" className="h-10 rounded-md" />
              </Form.Item>

              <Form.Item name="genres" label={<span className="uppercase text-xs font-bold text-gray-500">Genres</span>} rules={[{ required: true }]} className="col-span-1 md:col-span-2">
                <Select mode="multiple" className="min-h-10" placeholder="Select genres">
                  <Option value="Action">Action</Option>
                  <Option value="Sci-Fi">Sci-Fi</Option>
                  <Option value="Adventure">Adventure</Option>
                  <Option value="Drama">Drama</Option>
                  <Option value="Thriller">Thriller</Option>
                  <Option value="Fantasy">Fantasy</Option>
                  <Option value="Animation">Animation</Option>
                </Select>
              </Form.Item>

              <Form.Item name="synopsis" label={<span className="uppercase text-xs font-bold text-gray-500">Synopsis</span>} className="col-span-1 md:col-span-2">
                <TextArea rows={4} placeholder="Enter movie synopsis..." className="rounded-md p-3" />
              </Form.Item>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <Button onClick={() => navigate('/admin/movies')} className="h-10 px-8 rounded-md font-medium text-gray-600">Cancel</Button>
            <Button type="primary" htmlType="submit" className="h-10 px-8 rounded-md bg-blue-600 hover:bg-blue-700 font-medium shadow-md shadow-blue-600/20">
              Save Movie
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}