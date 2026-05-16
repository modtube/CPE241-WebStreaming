import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Spin,
  Button,
  Tag,
  message,
  Typography,
  Card,
  Row,
  Col,
  Table,
  Space,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const API_BASE_URL = "http://localhost:5000";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/movies/${id}`);
        if (!res.ok) throw new Error("Movie not found");
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        message.error("ไม่สามารถโหลดข้อมูลหนังได้");
        navigate("/admin/movies");
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetail();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/movies/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        message.success("ลบข้อมูลสำเร็จ");
        navigate("/admin/movies");
      }
    } catch (err) {
      message.error("ลบข้อมูลล้มเหลว");
    }
  };

  if (loading)
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gray-50 gap-4">
        <Spin size="large" />
        <Text className="text-gray-500">กำลังโหลดข้อมูล...</Text>
      </div>
    );

  if (!movie) return null;

  // Table Columns Definitions
  const castColumns = [
    { title: "ID", dataIndex: "person_id", key: "id", width: 80 },
    {
      title: "NAME",
      key: "name",
      render: (record: any) =>
        `${record.first_name || ""} ${record.last_name || ""}`,
    },
    { title: "ROLE", dataIndex: "role_type", key: "role" },
    {
      title: "CHARACTER",
      dataIndex: "character_name",
      key: "character",
      render: (text: string) => text || "-",
    },
  ];

  const resourceColumns = [
    { title: "ID", dataIndex: "language_id", key: "id", width: 80 },
    {
      title: "LANGUAGE",
      dataIndex: "language_name", // ใช้ชื่อฟิลด์ที่ดึงมาจาก SQL JOIN
      key: "lang",
      render: (text: string) => text || "Unknown",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Info Card */}
        <Card className="shadow-sm border-gray-200 rounded-xl mb-8 overflow-hidden">
          <Row gutter={40}>
            {/* Left: Poster */}
            <Col span={8}>
              <div className="rounded-lg overflow-hidden border border-gray-100 shadow-md">
                <img
                  // แก้ไข: เชื่อมต่อ API URL เข้ากับ img_path ที่ได้จาก DB
                  src={
                    movie.img_path?.startsWith("http")
                      ? movie.img_path
                      : `${API_BASE_URL}${movie.img_path}`
                  }
                  alt={movie.title}
                  className="w-full h-auto object-cover"
                  onError={(e: any) => {
                    e.target.src =
                      "https://via.placeholder.com/300x450?text=No+Poster";
                  }}
                />
              </div>
            </Col>

            {/* Right: Primary Details */}
            <Col span={16}>
              <div className="flex justify-between items-start mb-4">
                <Space direction="vertical" size={0}>
                  <Tag
                    color="green"
                    className="rounded-full px-3 mb-2 border-none"
                  >
                    Active
                  </Tag>
                  <Title level={1} className="!m-0 !font-bold text-gray-800">
                    {movie.title}
                  </Title>
                  <Text type="secondary" className="text-lg">
                    {movie.genres?.join(", ") || "No Genres"} •{" "}
                    {dayjs(movie.release_date).format("YYYY-MM-DD")}
                  </Text>
                </Space>

                <Space>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => navigate(`/admin/movies/edit/${id}`)}
                    className="rounded-lg h-10 px-6 border-gray-300"
                  >
                    Edit Content
                  </Button>
                  <Popconfirm
                    title="คุณแน่ใจหรือไม่ที่จะลบหนังเรื่องนี้?"
                    onConfirm={handleDelete}
                    okText="ใช่"
                    cancelText="ไม่"
                  >
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      className="rounded-lg h-10 px-6"
                    >
                      Delete
                    </Button>
                  </Popconfirm>
                </Space>
              </div>

              <div className="mt-8">
                <Title
                  level={5}
                  className="text-gray-400 uppercase tracking-widest text-xs mb-4"
                >
                  Synopsis
                </Title>
                <Paragraph className="text-gray-600 text-base leading-relaxed max-w-2xl">
                  {movie.movie_description || "ไม่มีข้อมูลรายละเอียด"}
                </Paragraph>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-8">
                <div>
                  <Title
                    level={5}
                    className="text-gray-400 uppercase tracking-widest text-xs mb-4"
                  >
                    Details
                  </Title>
                  <div className="space-y-3">
                    <div>
                      <Text className="text-gray-800 font-bold">Rating: </Text>
                      <Text className="text-gray-600">
                        {movie.rating_label || "Not Rated"}
                      </Text>
                    </div>
                    <div>
                      <Text className="text-gray-800 font-bold">Price : </Text>
                      <Text className="text-gray-600">
                        {Number(movie.price).toFixed(2)} $
                      </Text>
                    </div>
                  </div>
                </div>
                <div>
                  <Title
                    level={5}
                    className="text-gray-400 uppercase tracking-widest text-xs mb-4"
                  >
                    System Info
                  </Title>
                  <div className="space-y-3">
                    <div>
                      <Text className="text-gray-800 font-bold">
                        Last Updated:{" "}
                      </Text>
                      <Text className="text-gray-600">
                        {dayjs(movie.update_date).format("DD MMM YYYY")}
                      </Text>
                    </div>
                    <div>
                      <Text className="text-gray-800 font-bold">Review : </Text>
                      <Text className="text-gray-600">
                        {movie.average_rating || 0}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 text-right text-gray-300 font-mono text-sm">
                ID: {movie.movie_id}
              </div>
            </Col>
          </Row>
        </Card>

        {/* Secondary Info Sections */}
        <Row gutter={24}>
          <Col span={24} className="mt-8 mb-8">
            <Card
              title="Cast & Crew Members"
              className="shadow-sm border-gray-200 rounded-xl"
            >
              <Table
                dataSource={movie?.cast_and_crew || []}
                columns={castColumns}
                pagination={false}
                // แก้ไข: ระบุ record เป็น any และสร้าง string key ที่ไม่ซ้ำกัน
                rowKey={(record: any) =>
                  `cast-${record.person_id}-${record.role_type}`
                }
                size="middle"
              />
            </Card>
          </Col>

          <Col span={12}>
            <Card
              title="Supported Audio"
              className="shadow-sm border-gray-200 rounded-xl h-full"
            >
              <Table
                dataSource={(movie?.resources || []).filter(
                  (r: any) => r.type === "Audio",
                )}
                columns={resourceColumns}
                pagination={false}
                rowKey={(record: any) => `audio-${record.language_id}`} // ใส่ Key ป้องกัน Warning
                size="small"
              />
            </Card>
          </Col>

          <Col span={12}>
            <Card
              title="Supported Subtitle"
              className="shadow-sm border-gray-200 rounded-xl h-full"
            >
              <Table
                dataSource={(movie?.resources || []).filter(
                  (r: any) => r.type === "Subtitle",
                )}
                columns={resourceColumns}
                pagination={false}
                rowKey={(record: any) => `sub-${record.language_id}`} // ใส่ Key ป้องกัน Warning
                size="small"
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
