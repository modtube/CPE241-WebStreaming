import { Input, Button } from 'antd';
import { SearchOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

interface Props {
  title: string;
  onAdd?: () => void;
  buttonText?: string;
  searchText: string;
  onSearchChange: (val: string) => void;
  onDelete?: () => void; 
  selectedCount?: number; 
}

export default function ManagementHeader({ 
  title, onAdd, buttonText, searchText, onSearchChange, onDelete, selectedCount 
}: Props) {
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

      <div className="flex gap-3">
        {/* โชว์ปุ่ม Delete เมื่อมีคนถูกเลือก (selectedCount > 0) */}
        {selectedCount !== undefined && selectedCount > 0 && (
          <Button 
            danger
            icon={<DeleteOutlined />}
            onClick={onDelete}
            className="!h-10 px-6 rounded-lg flex items-center font-medium border-red-200 bg-red-50 hover:bg-red-100 text-red-600 shadow-sm"
          >
            Delete ({selectedCount})
          </Button>
        )}

        {/* ปุ่ม Add เดิม */}
        {onAdd && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={onAdd}
            className="bg-blue-600 hover:bg-blue-700 !h-10 px-6 rounded-lg flex items-center font-medium border-none shadow-sm text-white"
          >
            {buttonText || `Add ${title}`}
          </Button>
        )}
      </div>
    </div>
  );
}