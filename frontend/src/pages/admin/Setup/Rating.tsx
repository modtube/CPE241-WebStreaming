import { useState, useEffect } from "react";
import { Table, Input, Button, Space, message, Modal } from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Funnel } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import GenericAddModal from "../../../components/admin/setup/GenericSetupAdd.tsx";

interface Rating {
  rating_id: string;
  rating_label: string;
  maturity_level: number;
  rating_description: string;
}

export default function RatingSetup() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  // 🟢 1. สร้าง Modal Instance สำหรับใช้จัดการ Popup
  const [modal, contextHolder] = Modal.useModal();

  // ฟังก์ชันจัดการเปิด-ปิด Modal
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

  // 🟢 2. ฟังก์ชัน handleDelete สไตล์โมเดิร์นพร้อมระบุชื่อ Rating Label
  const handleDelete = (record: Rating) => {
    modal.confirm({
      title: null,
      icon: null,
      content: (
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <DeleteOutlined className="text-red-500 text-3xl" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            ยืนยันการลบข้อมูล
          </h3>

          <p className="text-gray-500">
            คุณแน่ใจหรือไม่ว่าต้องการลบระดับเรตติ้ง
            <span className="font-bold text-gray-800 mx-1">
              "{record.rating_label}"
            </span>
            ออกจากระบบ?
          </p>

          <p className="text-sm text-red-400 mt-4 bg-red-50 px-4 py-2 rounded-lg border border-red-100">
            * การดำเนินการนี้ไม่สามารถเรียกคืนข้อมูลกลับมาได้
          </p>
        </div>
      ),
      okText: `Delete ${record.rating_label}`,
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
            `http://localhost:5000/api/ratings/${record.rating_id}`,
            { method: "DELETE" },
          );

          if (!response.ok) throw new Error("Delete failed");

          message.success(`ลบเรตติ้ง ${record.rating_label} เรียบร้อยแล้ว`);
          fetchRatings(); // รีโหลดตาราง
        } catch (error) {
          message.error(
            "ไม่สามารถลบข้อมูลได้ เนื่องจากมีการเชื่อมโยงกับข้อมูลหนัง",
          );
        }
      },
    });
  };

  const fetchRatings = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/ratings?search=${searchText}`,
      );
      if (!response.ok) throw new Error("Fetch failed");
      const result = await response.json();
      setDataSource(result.data || result);
    } catch (error) {
      console.warn("Backend not found. Using Mockup Data instead.");
      setDataSource([
        {
          rating_id: "R001",
          rating_label: "G",
          maturity_level: 1,
          rating_description: "General Audiences",
        },
        {
          rating_id: "R002",
          rating_label: "PG",
          maturity_level: 7,
          rating_description: "Parental Guidance",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  const columns: ColumnsType<Rating> = [
    {
      title: "ID",
      dataIndex: "rating_id",
      key: "rating_id",
      width: "120px",
      sorter: (a, b) => a.rating_id.localeCompare(b.rating_id),
    },
    {
      title: "LABEL",
      dataIndex: "rating_label",
      key: "rating_label",
      width: "120px",
      // 🟢 เพิ่ม Filter กลับมาตามกำหนด
      filters: [...new Set(dataSource.map((item) => item.rating_label))].map(
        (label) => ({
          text: label,
          value: label,
        }),
      ),
      onFilter: (value, record) => record.rating_label === value,
      filterIcon: (filtered) => (
        <Funnel
          size={14}
          color={filtered ? "#3b82f6" : "#9ca3af"}
          strokeWidth={filtered ? 3 : 2}
        />
      ),
      render: (text) => <span className="font-bold text-gray-800">{text}</span>,
    },
    {
      title: "LEVEL",
      dataIndex: "maturity_level",
      key: "maturity_level",
      width: "120px",
      // 🟢 เพิ่ม Filter กลับมาตามกำหนด
      filters: [...new Set(dataSource.map((item) => item.maturity_level))]
        .sort((a, b) => a - b)
        .map((level) => ({
          text: `Level ${level}`,
          value: level,
        })),
      onFilter: (value, record) => record.maturity_level === value,
      filterIcon: (filtered) => (
        <Funnel
          size={14}
          color={filtered ? "#3b82f6" : "#9ca3af"}
          strokeWidth={filtered ? 3 : 2}
        />
      ),
      render: (lvl) => <span className="text-gray-500">Lv. {lvl}</span>,
    },
    {
      title: "DESCRIPTION",
      dataIndex: "rating_description",
      key: "rating_description",
      // 🟢 เพิ่ม Sort ตามกำหนด
      sorter: (a, b) =>
        (a.rating_description || "").localeCompare(b.rating_description || ""),
      render: (text) => (
        <span className="text-gray-400 truncate max-w-xs block">
          {text || "-"}
        </span>
      ),
    },
    {
      title: "ACTION",
      key: "action",
      width: "120px",
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

  const filteredData = dataSource.filter(
    (item) =>
      item.rating_label.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.rating_description ?? "")
        .toLowerCase()
        .includes(searchText.toLowerCase()),
  );

  return (
    <div className="p-4">
      {/* 🟢 contextHolder สำหรับ Popup */}
      {contextHolder}

      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-md">
          <Input
            placeholder="Search rating..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={fetchRatings}
            className="h-10 rounded-lg border-gray-300 shadow-sm"
          />
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="h-10 px-6 rounded-lg bg-blue-600"
          onClick={handleAdd}
        >
          Add Rating
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          rowKey="rating_id"
          pagination={{ pageSize: 8 }}
          className="[&_.ant-table-thead_th]:bg-gray-50/50"
        />
      </div>

      <GenericAddModal
        title="Rating"
        open={isModalOpen}
        editData={editingRecord}
        pkField="rating_id"
        onCancel={handleCloseModal}
        onSuccess={() => {
          handleCloseModal();
          fetchRatings();
        }}
        apiEndpoint="http://localhost:5000/api/ratings"
        fields={[
          { label: "Rating Label", name: "rating_label", required: true },
          {
            label: "Maturity Level",
            name: "maturity_level",
            type: "number",
            required: true,
          },
          {
            label: "Description",
            name: "rating_description",
            type: "textarea",
            required: false,
          },
        ]}
      />
    </div>
  );
}
