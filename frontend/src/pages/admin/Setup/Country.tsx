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

interface Country {
  country_code: string;
  country_name: string;
}

export default function CountrySetup() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Country | null>(null);

  // 🟢 1. สร้าง Modal Instance และ ContextHolder
  const [modal, contextHolder] = Modal.useModal();

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/countries?search=${searchText}`,
      );
      if (!response.ok) throw new Error("Fetch failed");
      const result = await response.json();
      setDataSource(result.data || result);
    } catch (error) {
      console.warn("Backend not found. Using Mockup Data instead.");
      setDataSource([
        { country_code: "TH", country_name: "Thailand" },
        { country_code: "EN", country_name: "England" },
        { country_code: "CN", country_name: "China" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // 🟢 2. ฟังก์ชันจัดการการเปิด-ปิด Modal (แบบล้างค่า)
  const handleAdd = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: Country) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleDelete = (record: Country) => {
    modal.confirm({
      title: null, // เราจะใส่ title เองข้างใน content เพื่อความอิสระในการจัด style
      icon: null, // ปิดไอคอนเริ่มต้นของ antd
      content: (
        <div className="flex flex-col items-center text-center py-4">
          {/* ไอคอนถังขยะในวงกลมสีแดง */}
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <DeleteOutlined className="text-red-500 text-3xl" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            ยืนยันการลบข้อมูล
          </h3>

          <p className="text-gray-500">
            คุณแน่ใจหรือไม่ว่าต้องการลบประเทศ
            <span className="font-bold text-gray-800 mx-1">
              "{record.country_name}"
            </span>
            ออกจากระบบ?
          </p>

          <p className="text-sm text-red-400 mt-4 bg-red-50 px-4 py-2 rounded-lg border border-red-100">
            * การดำเนินการนี้ไม่สามารถเรียกคืนข้อมูลกลับมาได้
          </p>
        </div>
      ),
      okText: `Delete ${record.country_name}`, // เปลี่ยนข้อความปุ่มตามชื่อประเทศ
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      width: 400,
      // ตกแต่งปุ่มผ่าน okButtonProps
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
            `http://localhost:5000/api/countries/${record.country_code}`,
            { method: "DELETE" },
          );
          if (!response.ok) throw new Error("Delete failed");
          message.success(`ลบประเทศ ${record.country_name} สำเร็จแล้ว`);
          fetchCountries();
        } catch (error) {
          message.error("ไม่สามารถลบข้อมูลได้ เนื่องจากมีการใช้งานอยู่");
        }
      },
    });
  };

  const columns: ColumnsType<Country> = [
    {
      title: "CODE",
      dataIndex: "country_code",
      key: "country_code",
      width: "15%",
      sorter: (a, b) => a.country_code.localeCompare(b.country_code),
      render: (text) => <span className="font-bold text-gray-800">{text}</span>,
    },
    {
      title: "ENGLISH NAME",
      dataIndex: "country_name",
      key: "country_name",
      width: "70%",
      sorter: (a, b) => a.country_name.localeCompare(b.country_name),
      render: (text) => <span className="text-gray-500">{text}</span>,
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

  const filteredData = dataSource.filter(
    (item) =>
      item.country_name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.country_code.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div className="p-4">
      {/* 🟢 4. วาง contextHolder ไว้ที่นี่เพื่อให้ Modal เด้งออกมาได้ */}
      {contextHolder}

      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-md">
          <Input
            placeholder="Search country..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={fetchCountries}
            className="h-10 rounded-lg border-gray-300 shadow-sm"
          />
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="h-10 px-6 rounded-lg bg-blue-600"
          onClick={handleAdd}
        >
          Add Country
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          rowKey="country_code"
          pagination={{ pageSize: 6 }}
          className="[&_.ant-table-thead_th]:bg-gray-50/50"
        />
      </div>

      <GenericAddModal
        title="Country"
        open={isModalOpen}
        editData={editingRecord}
        pkField="country_code"
        onCancel={handleCloseModal}
        onSuccess={() => {
          handleCloseModal();
          fetchCountries();
        }}
        apiEndpoint="http://localhost:5000/api/countries"
        fields={[
          { label: "Country Code", name: "country_code", required: true },
          { label: "Country Name", name: "country_name", required: true },
        ]}
      />
    </div>
  );
}
