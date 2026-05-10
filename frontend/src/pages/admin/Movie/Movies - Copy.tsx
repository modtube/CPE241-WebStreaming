import { useState, useEffect, useCallback } from "react";
import { Table, Input, Button, message, Space, Tag } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";

interface Movie {
  movie_id: number;
  title: string;
  img_path: string;
  release_date: string;
  price: string;
  rating_label: string;
  country_name: string;
  genres: string[];
}

// 💡 Interface สำหรับตัวเลือก Filter
interface Country {
  country_code: string;
  country_name: string;
}

interface Rating {
  rating_id: number;
  rating_label: string;
}

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // 💡 State สำหรับตัวเลือก Filter
  const [countries, setCountries] = useState<Country[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [sortParams, setSortParams] = useState<{
    field: string;
    order: string;
  }>({
    field: "movie_id",
    order: "ascend",
  });

  const [filters, setFilters] = useState<Record<string, FilterValue | null>>(
    {},
  );

  // 💡 ดึง Option มาจาก API (Rating ไม่ใช้ .data)
  const fetchFilterOptions = async () => {
    try {
      const [countryRes, ratingRes] = await Promise.all([
        fetch("http://localhost:5000/api/countries"),
        fetch("http://localhost:5000/api/ratings"),
      ]);
      const countryData = await countryRes.json();
      const ratingData = await ratingRes.json();

      if (countryRes.ok) setCountries(countryData.data || []);
      if (ratingRes.ok) setRatings(ratingData || []);
    } catch (error) {
      console.error("Failed to fetch filter options", error);
    }
  };

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: String(pagination.current),
        limit: String(pagination.pageSize),
        sort_by: sortParams.field,
        order: sortParams.order === "ascend" ? "ASC" : "DESC",
        ...(searchText && { search: searchText }),
        // 💡 ปรับตาม API: ?rating= และ ?country=
        ...(filters.rating_label?.[0] && {
          rating: String(filters.rating_label[0]),
        }),
        ...(filters.country_name?.[0] && {
          country: String(filters.country_name[0]),
        }),
      });

      const response = await fetch(`http://localhost:5000/api/movies?${query}`);
      const result = await response.json();

      if (response.ok) {
        setMovies(result.data);
        setPagination((prev) => ({
          ...prev,
          total: result.pagination.total_items,
        }));
      }
    } catch (error) {
      message.error("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  }, [
    pagination.current,
    pagination.pageSize,
    searchText,
    sortParams,
    filters,
  ]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    newFilters: Record<string, FilterValue | null>,
    sorter: SorterResult<Movie> | SorterResult<Movie>[],
  ) => {
    setPagination(newPagination);
    setFilters(newFilters);

    if (!Array.isArray(sorter)) {
      const nextOrder =
        sorter.order || (sortParams.order === "ascend" ? "descend" : "ascend");
      setSortParams({
        field: (sorter.field as string) || sortParams.field,
        order: nextOrder,
      });
    }
  };

  const columns: ColumnsType<Movie> = [
    {
      title: "ID",
      dataIndex: "movie_id",
      sorter: true,
      sortOrder:
        sortParams.field === "movie_id" ? (sortParams.order as any) : null,
      sortDirections: ["ascend", "descend", "ascend"],
      width: 80,
    },
    {
      title: "Movie",
      dataIndex: "title",
      render: (text, record) => (
        <Space>
          <img
            src={record.img_path}
            alt={text}
            className="w-12 h-16 object-cover rounded shadow-sm"
          />
          <span className="font-medium text-gray-700">{text}</span>
        </Space>
      ),
    },
    {
      title: "Genre",
      dataIndex: "genres",
      render: (genres: string[]) => (
        <Space size={[0, 4]} wrap>
          {genres?.map((genre) => (
            <Tag color="blue" key={genre}>
              {genre}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating_label",
      // 💡 แก้ไข Filter ให้ดึงจาก State
      filters: ratings.map((r) => ({
        text: r.rating_label,
        value: r.rating_label,
      })),
      filterMultiple: false,
      filteredValue: filters.rating_label || null,
      width: 120,
    },
    {
      title: "Release Date",
      dataIndex: "release_date",
      render: (date) => new Date(date).toLocaleDateString(),
      width: 150,
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => `฿${parseFloat(price).toLocaleString()}`,
      width: 120,
    },
    {
      title: "Country",
      dataIndex: "country_name",
      // 💡 แก้ไข Filter ให้ดึงจาก State
      filters: countries.map((c) => ({
        text: c.country_name,
        value: c.country_code,
      })),
      filterMultiple: false,
      filteredValue: filters.country_name || null,
      width: 150,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: () => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            className="text-blue-500"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            className="text-red-500"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Movie Management</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Search movies..."
            prefix={<SearchOutlined className="text-gray-400" />}
            className="w-72 h-10 rounded-lg"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={() => {
              setPagination({ ...pagination, current: 1 });
              fetchMovies();
            }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="h-10 rounded-lg bg-red-600 hover:bg-red-700"
          >
            Add Movie
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={movies}
        loading={loading}
        rowKey="movie_id"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total} movies`,
        }}
        onChange={handleTableChange}
        className="border border-gray-100 rounded-lg overflow-hidden"
      />
    </div>
  );
}
