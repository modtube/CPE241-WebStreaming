import { useState, useEffect } from "react";
import { Table, Input, Button, Space, message } from "antd";
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
      // 🚨 MOCKUP DATA: ส่วนนี้จะทำงานเมื่อหา Backend ไม่เจอ (คอมเมนต์ทิ้งได้เลยเมื่อเชื่อม API จริงเสร็จ)
      console.warn("Backend not found. Using Mockup Data instead.");
      setDataSource([
        {
          rating_label: "G",
          maturity_level: 1,
          rating_description: "General Audiences — suitable for all ages.",
        },
        {
          rating_label: "PG",
          maturity_level: 2,
          rating_description: "Parental Guidance suggested — some material...",
        },
        {
          rating_label: "PG-13",
          maturity_level: 3,
          rating_description: "Parents strongly cautioned — some material...",
        },
        {
          rating_label: "TV-14",
          maturity_level: 4,
          rating_description:
            "Parents strongly cautioned for children under...",
        },
        {
          rating_label: "R",
          maturity_level: 5,
          rating_description: "Restricted — under 17 requires accompanying...",
        },
        {
          rating_label: "TV-MA",
          maturity_level: 5,
          rating_description: "Mature Audiences Only — may be unsuitable...",
        },
        {
          rating_label: "NC-17",
          maturity_level: 5,
          rating_description: "Adults Only — no one 17 and under admitted.",
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
      title: "rating_label",
      dataIndex: "rating_label",
      key: "rating_label",
      width: "150px",
      filters: dataSource.map((entry) => ({
        text: entry.rating_label,
        value: entry.rating_label,
      })),
      onFilter: (value, record) => record.rating_label === value,
      filterIcon: (filtered) => (
        <Funnel
          size={16}
          color={filtered ? "#3b82f6" : "#9ca3af"}
          strokeWidth={filtered ? 3 : 2}
        />
      ),
      render: (text) => (
        <span className="font-medium text-gray-700">{text}</span>
      ),
    },
    {
      title: "MATURITY-LVL",
      dataIndex: "maturity_level",
      key: "maturity_level",
      width: "150px",
      filters: [...new Set(dataSource.map((item) => item.maturity_level))]
        .sort((a, b) => a - b)
        .map((level) => ({
          text: `Level ${level}`,
          value: level,
        })),
      onFilter: (value, record) =>
        Number(record.maturity_level) === Number(value),
      filterIcon: (filtered) => (
        <Funnel
          size={16}
          color={filtered ? "#3b82f6" : "#9ca3af"}
          strokeWidth={filtered ? 3 : 2}
        />
      ),
      render: (lvl) => <span className="text-gray-500">{lvl}</span>,
    },
    {
      title: "rating_description",
      dataIndex: "rating_description",
      key: "rating_description",
      sorter: (a, b) =>
        a.rating_description.localeCompare(b.rating_description),
      render: (text) => (
        <span className="text-gray-500 truncate max-w-sm inline-block">
          {text}
        </span>
      ),
    },
    {
      title: "ACTION",
      key: "action",
      width: "150px",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            className="text-gray-400 hover:text-blue-600 cursor-pointer text-lg transition-colors"
            onClick={() =>
              navigate(`/admin/setups/rating/edit/${record.rating_label}`)
            }
          />
          <DeleteOutlined
            className="text-gray-400 hover:text-red-500 cursor-pointer text-lg transition-colors"
            onClick={() =>
              message.warning(`Delete rating: ${record.rating_label}`)
            }
          />
        </Space>
      ),
    },
  ];

  const filteredData = dataSource.filter(
    (item) =>
      item.rating_label.toLowerCase().includes(searchText.toLowerCase()) ||
      item.rating_description
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      item.maturity_level.toString().includes(searchText.toLowerCase()),
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-md">
          <Input
            placeholder="Search by rating-label, maturity-level, or description..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={() => fetchRatings()}
            className="h-10 rounded-lg border-gray-300 shadow-sm"
          />
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="h-10 px-6 rounded-lg bg-blue-600"
          onClick={() => setIsModalOpen(true)} // เปลี่ยนจาก navigate เป็นเปิด Modal
        >
          Add Rating
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          rowKey="rating_label"
          pagination={{
            pageSize: 8,
            showTotal: (total, range) => (
              <span className="text-gray-400 font-normal">
                Showing {range[0]} to {range[1]} of {total} results
              </span>
            ),
          }}
          className="[&_.ant-table-thead_th]:bg-gray-50/50 [&_.ant-table-thead_th]:border-b [&_.ant-table-thead_th]:text-[12px] [&_.ant-table-thead_th]:text-gray-400 [&_.ant-table-thead_th]:font-semibold [&_.ant-table-thead_th]:py-4 [&_.ant-table-column-sorters]:flex-row-reverse [&_.ant-table-column-sorters]:gap-2 [&_.ant-table-filter-column]:flex-row-reverse [&_.ant-table-filter-column]:justify-end [&_.ant-table-filter-column]:gap-2 [&_.ant-pagination]:!flex [&_.ant-pagination]:!w-full [&_.ant-pagination]:!px-6 [&_.ant-pagination]:!py-5 [&_.ant-pagination-total-text]:!mr-auto"
        />
      </div>
      <GenericAddModal
        title="Add Rating"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchRatings(); // รีโหลดตารางเมื่อเพิ่มสำเร็จ
        }}
        apiEndpoint="http://localhost:5000/api/ratings"
        fields={[
          { label: "Rating Label", name: "rating_label", required: true },
          { label: "Maturity Level", name: "maturity_level", required: true },
          { label: "Description", name: "rating_description", required: false },
        ]}
      />
    </div>
  );
}
