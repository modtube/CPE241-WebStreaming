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
      // 🚨 MOCKUP DATA: ส่วนนี้จะทำงานเมื่อหา Backend ไม่เจอ (คอมเมนต์ทิ้งได้เลยเมื่อเชื่อม API จริงเสร็จ)
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
            onClick={() =>
              navigate(`/admin/setups/country/edit/${record.country_code}`)
            }
          />
          <DeleteOutlined
            className="text-gray-400 hover:text-red-500 cursor-pointer text-lg transition-colors"
            onClick={() =>
              message.warning(`Delete country: ${record.country_name}`)
            }
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
      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-md">
          <Input
            placeholder="Search by country-code or country-name..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={() => fetchCountries()}
            className="h-10 rounded-lg border-gray-300 shadow-sm"
          />
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="h-10 px-6 rounded-lg bg-blue-600"
          onClick={() => setIsModalOpen(true)} // เปลี่ยนจาก navigate เป็นเปิด Modal
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
          pagination={{
            pageSize: 6,
            showTotal: (total, range) => (
              <span className="text-gray-400 font-normal">
                Showing {range[0]} to {range[1]} of {total} results
              </span>
            ),
          }}
          className="[&_.ant-table-thead_th]:bg-gray-50/50 [&_.ant-table-thead_th]:border-b [&_.ant-table-thead_th]:text-[12px] [&_.ant-table-thead_th]:text-gray-400 [&_.ant-table-thead_th]:font-semibold [&_.ant-table-thead_th]:py-4 [&_.ant-table-column-sorters]:flex-row-reverse [&_.ant-table-column-sorters]:gap-2 [&_.ant-pagination]:!flex [&_.ant-pagination]:!w-full [&_.ant-pagination]:!px-6 [&_.ant-pagination]:!py-5 [&_.ant-pagination-total-text]:!mr-auto"
        />
      </div>
      <GenericAddModal
        title="Add Country"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchCountries(); // รีโหลดตารางเมื่อเพิ่มสำเร็จ
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
