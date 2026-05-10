import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, DatePicker, Upload, message, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

// Define form fields based on SQL Schema attributes
const personFields = [
  { label: 'First Name', name: 'first_name', required: true, type: 'text', colSpan: 'col-span-1' },
  { label: 'Middle Name', name: 'middle_name', required: false, type: 'text', colSpan: 'col-span-1' },
  { label: 'Last Name', name: 'last_name', required: true, type: 'text', colSpan: 'col-span-1' },
  { label: 'Birth Date', name: 'birth_date', required: true, type: 'date', colSpan: 'col-span-1' },
  { label: 'Birth Place', name: 'birth_place', required: true, type: 'text', colSpan: 'col-span-1' },
  { label: 'Nationality', name: 'nationality', required: true, type: 'text', colSpan: 'col-span-1' },
  { label: 'Biography', name: 'biography', required: false, type: 'textarea', colSpan: 'lg:col-span-3' },
];

export default function App() {
  const { id } = useParams(); // Get ID (e.g., 'P00001') from the URL
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // --- 1. Data Fetching Logic (Fetch existing data for editing) ---
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`http://localhost:5000/api/crew/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch');
          return res.json();
        })
        .then((data) => {
          if (data) {
            // Fill the form with data received from the API
            form.setFieldsValue({
              ...data,
              // Important: Ant Design's DatePicker requires a dayjs object
              birth_date: data.birth_date ? dayjs(data.birth_date) : null,
            });
          }
        })
        .catch((err) => {
          console.error(err);
          message.error("Failed to fetch crew member data.");
        })
        .finally(() => setLoading(false));
    }
  }, [id, form]);

  // --- 2. Data Submission Logic (Create/Update) ---
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Use PUT for Edit (if ID exists) or POST for Add (if no ID)
      const url = id 
        ? `http://localhost:5000/api/crew/${id}` 
        : `http://localhost:5000/api/crew`;
      
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          // Format the date back to a string (YYYY-MM-DD) before sending to DB
          birth_date: values.birth_date ? values.birth_date.format('YYYY-MM-DD') : null,
        }),
      });

      if (response.ok) {
        message.success(id ? 'Update successful' : 'Creation successful');
        navigate('/admin/crew');
      } else {
        throw new Error('Save operation failed');
      }
    } catch (error) {
      console.error(error);
      message.error("An error occurred while saving the data.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading indicator while waiting for data (Edit mode only)
  if (loading && id) {
    return (
      <div className="h-64 flex items-center justify-center bg-transparent">
        <Spin size="large" tip="Loading data..." />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold mb-6 text-gray-800">
          {id ? `Edit Person Detail: ${id}` : 'Create New Person Detail'}
        </h3>
        
        <Form layout="vertical" form={form} onFinish={onFinish}>
          
          {/* Image Upload Section */}
          <div className="mb-10 block w-full"> 
            <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Profile Image</p>
            
            <Form.Item 
              name="img_path" 
              className="mb-0"
            >
              <Upload 
                showUploadList={false}
                className="w-full [&>.ant-upload]:w-full [&>.ant-upload]:block"
              >
                <div className="flex flex-col items-center justify-center w-full max-w-[300px] h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 transition-all cursor-pointer group">
                  <PlusOutlined className="text-gray-400 text-3xl mb-2 group-hover:text-blue-500" />
                  <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase group-hover:text-blue-500">
                    [ Profile Image ]
                  </span>
                </div>
              </Upload>
            </Form.Item>
          </div>

          {/* Input Fields Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {personFields.map((field) => (
              <Form.Item
                key={field.name}
                className={field.colSpan}
                label={<span className="uppercase text-xs font-bold text-gray-500 tracking-wider">{field.label}</span>}
                name={field.name}
                rules={[{ required: field.required, message: `${field.label} is required!` }]}
              >
                {field.type === 'date' ? (
                  <DatePicker 
                    className="w-full h-10 rounded-md" 
                    placeholder="Select Date" 
                    format="YYYY-MM-DD"
                  />
                ) : field.type === 'textarea' ? (
                  <Input.TextArea 
                    rows={6} 
                    placeholder="Enter biography text..." 
                    className="rounded-md p-3" 
                  />
                ) : (
                  <Input 
                    placeholder={`Enter ${field.label.toLowerCase()}...`} 
                    className="h-10 rounded-md" 
                  />
                )}
              </Form.Item>
            ))}
          </div>

          {/* Footer Action Buttons */}
          <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-gray-100">
            <Button 
              onClick={() => navigate('/admin/crew')}
              className="h-10 px-8 rounded-md font-medium text-gray-600"
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className="h-10 px-8 rounded-md bg-blue-600 hover:bg-blue-700 font-medium shadow-md shadow-blue-600/20"
            >
              {id ? 'Save Changes' : 'Create Person'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}