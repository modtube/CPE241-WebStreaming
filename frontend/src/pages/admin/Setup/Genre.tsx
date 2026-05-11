import { useState, useEffect } from "react";
import { Table, Input, Button, Space, message } from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import GenericAddModal from "../../../components/admin/setup/GenericSetupAdd.tsx";

interface Genre {
  genre_id: string;
  genre_name: string;
}

export default function GenreSetup() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchGenres = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/genres?search=${searchText}`,
      );
      if (!response.ok) throw new Error("Fetch failed");
      const result = await response.json();
      setDataSource(result.data || result);
    } catch (error) {
      // 🚨 MOCKUP DATA: ส่วนนี้จะทำงานเมื่อหา Backend ไม่เจอ (คอมเมนต์ทิ้งได้เลยเมื่อเชื่อม API จริงเสร็จ)
      console.warn("Backend not found. Using Mockup Data instead.");
      setDataSource([
        { genre_id: "001", genre_name: "Comedy" },
        { genre_id: "002", genre_name: "Drama" },
        { genre_id: "003", genre_name: "Horror" },
        { genre_id: "004", genre_name: "Sci-Fi" },
        { genre_id: "005", genre_name: "Romance" },
        { genre_id: "006", genre_name: "Thriller" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const columns: ColumnsType<Genre> = [
    {
      title: "ID",
      dataIndex: "genre_id",
      key: "genre_id",
      width: "15%",
      sorter: (a, b) => a.genre_id.localeCompare(b.genre_id),
    },
    {
      title: "GENRE",
      dataIndex: "genre_name",
      key: "genre_name",
      width: "70%",
      sorter: (a, b) => a.genre_name.localeCompare(b.genre_name),
      render: (text) => (
        <span className="font-medium text-gray-700">{text}</span>
      ),
    },
    {
      title: "ACTION",
      key: "action",
      width: "15%", // จัดให้ปุ่มอยู่ชิดขวาพอดีๆ
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            className="text-gray-400 hover:text-blue-600 cursor-pointer text-lg transition-colors"
            onClick={() =>
              navigate(`/admin/setups/genre/edit/${record.genre_id}`)
            }
          />
          <DeleteOutlined
            className="text-gray-400 hover:text-red-500 cursor-pointer text-lg transition-colors"
            onClick={() =>
              message.warning(`Delete genre: ${record.genre_name}`)
            }
          />
        </Space>
      ),
    },
  ];

  // เก็บไว้กรอง Mockup ชั่วคราว
  const filteredData = dataSource.filter(
    (item) =>
      item.genre_id.toLowerCase().includes(searchText.toLowerCase()) ||
      item.genre_name.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-md">
          <Input
            placeholder="Search by id, or genre-name..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={() => fetchGenres()}
            className="h-10 rounded-lg border-gray-300 shadow-sm"
          />
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="h-10 px-6 rounded-lg bg-blue-600"
          onClick={() => setIsModalOpen(true)} // เปลี่ยนจาก navigate เป็นเปิด Modal
        >
          Add Genre
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredData} // เปลี่ยนเป็น dataSource เมื่อต่อ API จริง
          loading={loading}
          rowKey="genre_id"
          pagination={{
            pageSize: 6,
            showTotal: (total, range) => (
              <span className="text-gray-400 font-normal">
                Showing {range[0]} to {range[1]} of {total} results
              </span>
            ),
          }}
          className="
            [&_.ant-table-thead_th]:bg-gray-50/50 
            [&_.ant-table-thead_th]:border-b 
            [&_.ant-table-thead_th]:text-[12px] 
            [&_.ant-table-thead_th]:text-gray-400 
            [&_.ant-table-thead_th]:font-semibold 
            [&_.ant-table-thead_th]:py-4 
            [&_.ant-table-column-sorters]:flex-row-reverse 
            [&_.ant-table-column-sorters]:gap-2 
            [&_.ant-pagination]:!flex 
            [&_.ant-pagination]:!w-full 
            [&_.ant-pagination]:!px-6 
            [&_.ant-pagination]:!py-5 
            [&_.ant-pagination-total-text]:!mr-auto
          "
        />
      </div>
      <GenericAddModal
        title="Add Genre"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchGenres(); // รีโหลดตารางเมื่อเพิ่มสำเร็จ
        }}
        apiEndpoint="http://localhost:5000/api/genres"
        fields={[{ label: "Genre Name", name: "genre_name", required: true }]}
      />
    </div>
  );
}
