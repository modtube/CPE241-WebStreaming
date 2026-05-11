import { useState, useEffect } from "react";
import { Table, Input, Button, Space, message, Modal } from "antd";
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
  const [editingRecord, setEditingRecord] = useState<any>(null);

  // 🟢 1. สร้าง Modal Instance สำหรับใช้จัดการ Popup
  const [modal, contextHolder] = Modal.useModal();

  // ฟังก์ชันสำหรับเปิด-ปิด Modal
  const handleAdd = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  // 🟢 2. ฟังก์ชัน handleDelete สไตล์โมเดิร์นพร้อมระบุชื่อ Genre
  const handleDelete = (record: Genre) => {
    modal.confirm({
      title: null,
      icon: null,
      content: (
        <div className="flex flex-col items-center text-center py-4">
          {/* ไอคอนถังขยะดีไซน์ใหม่ */}
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <DeleteOutlined className="text-red-500 text-3xl" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            ยืนยันการลบข้อมูล
          </h3>

          <p className="text-gray-500">
            คุณแน่ใจหรือไม่ว่าต้องการลบแนวหนัง (Genre)
            <span className="font-bold text-gray-800 mx-1">
              "{record.genre_name}"
            </span>
            ออกจากระบบ?
          </p>

          <p className="text-sm text-red-400 mt-4 bg-red-50 px-4 py-2 rounded-lg border border-red-100">
            * การดำเนินการนี้ไม่สามารถเรียกคืนข้อมูลกลับมาได้
          </p>
        </div>
      ),
      okText: `Delete ${record.genre_name}`, // ปุ่มลบระบุชื่อ Genre
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      width: 400,
      okButtonProps: {
        className:
          "h-11 px-6 rounded-lg font-semibold shadow-md shadow-red-200",
      },
      cancelButtonProps: {
        className: "h-11 px-6 rounded-lg font-medium",
      },
      async onOk() {
        try {
          const response = await fetch(
            `http://localhost:5000/api/genres/${record.genre_id}`,
            { method: "DELETE" },
          );

          if (!response.ok) throw new Error("Delete failed");

          message.success(`ลบแนวหนัง ${record.genre_name} เรียบร้อยแล้ว`);
          fetchGenres(); // รีโหลดตาราง
        } catch (error) {
          message.error(
            "ไม่สามารถลบข้อมูลได้ เนื่องจากมีการเชื่อมโยงกับข้อมูลอื่น",
          );
        }
      },
    });
  };

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
      console.warn("Backend not found. Using Mockup Data instead.");
      setDataSource([
        { genre_id: "G001", genre_name: "Action" },
        { genre_id: "G002", genre_name: "Comedy" },
        { genre_id: "G003", genre_name: "Drama" },
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
      width: "20%",
      sorter: (a, b) => a.genre_id.localeCompare(b.genre_id),
    },
    {
      title: "GENRE NAME",
      dataIndex: "genre_name",
      key: "genre_name",
      width: "65%",
      sorter: (a, b) => a.genre_name.localeCompare(b.genre_name),
      render: (text) => (
        <span className="font-medium text-gray-700">{text}</span>
      ),
    },
    {
      title: "ACTION",
      key: "action",
      width: "15%",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            className="text-gray-400 hover:text-blue-600 cursor-pointer text-lg transition-colors"
            onClick={() => handleEdit(record)}
          />
          <DeleteOutlined
            className="text-gray-400 hover:text-red-500 cursor-pointer text-lg transition-colors"
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  const filteredData = dataSource.filter((item) =>
    item.genre_name.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div className="p-4">
      {/* 🟢 3. อย่าลืม contextHolder วางไว้บนสุด */}
      {contextHolder}

      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-md">
          <Input
            placeholder="Search genre..."
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
          onClick={handleAdd}
        >
          Add Genre
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          rowKey="genre_id"
          pagination={{ pageSize: 6 }}
          className="[&_.ant-table-thead_th]:bg-gray-50/50"
        />
      </div>

      <GenericAddModal
        title="Genre"
        open={isModalOpen}
        editData={editingRecord}
        pkField="genre_id"
        onCancel={handleCloseModal}
        onSuccess={() => {
          handleCloseModal();
          fetchGenres();
        }}
        apiEndpoint="http://localhost:5000/api/genres"
        fields={[{ label: "Genre Name", name: "genre_name", required: true }]}
      />
    </div>
  );
}
