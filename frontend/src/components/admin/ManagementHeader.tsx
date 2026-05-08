import { Input, Button } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

interface Props {
  title: string;
  onAdd: () => void;
  searchText: string;
  onSearchChange: (val: string) => void;
}

export default function ManagementHeader({ title, onAdd, searchText, onSearchChange }: Props) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="w-full max-w-md">
        <Input
          placeholder={`Search ${title.toLowerCase()}...`}
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 rounded-lg border-gray-300 shadow-sm"
        />
      </div>
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={onAdd}
        className="bg-blue-600 hover:bg-blue-700 h-full px-6 rounded-lg flex items-center font-medium"
      >
        Add Content
      </Button>
    </div>
  );
}