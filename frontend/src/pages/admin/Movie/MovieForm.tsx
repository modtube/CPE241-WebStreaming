import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  DatePicker, 
  Select, 
  Checkbox, 
  message, 
  Spin, 
  Card, 
  Row, 
  Col, 
  Empty, 
  Typography,
  InputNumber,
  Upload 
} from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  ArrowLeftOutlined,
  UploadOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Title, Text } = Typography;

// --- Types & Interfaces ---
interface Genre {
  genre_id: string;
  genre_name: string;
}

interface Rating {
  rating_id: string;
  rating_label: string;
}

interface Language {
  language_id: string;
  language_name: string;
}

interface Country {
  country_code: string;
  country_name: string;
}

interface Person {
  person_id: string;
  first_name: string;
  last_name: string;
}

export default function App() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  
  // Master Data States
  const [genres, setGenres] = useState<Genre[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);

  const qualityOptions = [
    { id: 'SD', name: 'SD (480p)' },
    { id: 'HD', name: 'HD (720p)' },
    { id: 'FHD', name: 'FHD (1080p)' },
    { id: 'QHD', name: 'QHD (1440p)' },
    { id: '2K', name: '2K' },
    { id: 'UHD', name: 'UHD (4K)' },
    { id: 'FUHD', name: 'FUHD (8K)' },
  ];

  // 1. Fetch Master Data from Database
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [gRes, rRes, lRes, cRes, pRes] = await Promise.all([
          fetch('http://localhost:5000/api/genres'),
          fetch('http://localhost:5000/api/ratings'),
          fetch('http://localhost:5000/api/languages'),
          fetch('http://localhost:5000/api/countries'),
          fetch('http://localhost:5000/api/persons'),
        ]);
        
        if (gRes.ok) setGenres(await gRes.json());
        if (rRes.ok) setRatings(await rRes.json());
        if (lRes.ok) setLanguages(await lRes.json());
        if (cRes.ok) setCountries(await cRes.json());
        if (pRes.ok) setPersons(await pRes.json());
      } catch (err) {
        message.error("Failed to load master data. Please check your connection.");
      }
    };
    
    fetchMasterData();
    if (id) fetchMovieDetail();
  }, [id]);

  // 2. Fetch movie details for editing
  const fetchMovieDetail = async () => {
    setInitialLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/movies/${id}`);
      if (!res.ok) throw new Error("Movie not found");
      const result = await res.json();
      
      // สำคัญ: เข้าถึงข้อมูลผ่าน result (เนื่องจาก controller ส่ง { data: ... })
      // หาก controller ส่งข้อมูลตรงๆ ให้ใช้ result
      const movieData = result; 

      form.setFieldsValue({
        ...movieData,
        release_date: movieData.release_date ? dayjs(movieData.release_date) : null,
        
        // ดึง Genre IDs มาใส่ (controller ส่งเป็น Array ของ ID มาให้แล้ว)
        genres: movieData.genres || [], 

        // ตรวจสอบชื่อฟิลด์ให้ตรงกับ Database Alias ใน controller
        rating_id: movieData.rating_id,
        country_code: movieData.country_code,

        // Map Media Files
        media_files: movieData.media_files?.length > 0 ? movieData.media_files : [{}],

        // Map Resources: ใน controller ใช้ 'type' (จาก lang_type)
        resources: movieData.resources?.map((r: any) => ({
          type: r.type, 
          language_id: r.language_id,
          file_path: r.file_path,
          priority: r.priority
        })) || [{}],

        // Map Cast & Crew: มั่นใจว่าตรงกับฟิลด์ person_id
        cast_and_crew: movieData.cast_and_crew?.map((p: any) => ({
          person_id: p.person_id,
          role_type: p.role_type,
          character_name: p.character_name
        })) || [{}],
      });
    } catch (err) {
      console.error(err);
      message.error("Error loading movie details.");
    } finally {
      setInitialLoading(false);
    }
  };

  // 3. Handle submission
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        release_date: values.release_date ? values.release_date.format('YYYY-MM-DD') : null,
        price: parseFloat(values.price || 0),
        media_files: (values.media_files || []).filter((f: any) => f.quality && f.file_path),
        resources: (values.resources || []).filter((r: any) => r.language_id && r.file_path),
        cast_and_crew: (values.cast_and_crew || []).filter((p: any) => p.person_id && p.role_type)
      };

      const url = id ? `http://localhost:5000/api/movies/${id}` : `http://localhost:5000/api/movies`;
      const method = id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        message.success(id ? 'Movie updated successfully' : 'Movie created successfully');
        navigate('/admin/movies');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Operation failed');
      }
    } catch (err: any) {
      message.error(err.message || "An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  const SearchableSelect = ({ options, placeholder, valueKey, labelKey, multiple = false }: any) => (
    <Select
      showSearch
      mode={multiple ? 'multiple' : undefined}
      placeholder={placeholder}
      optionFilterProp="label"
      filterOption={(input, option) =>
        String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={options.map((item: any) => {
        const labelParts = labelKey.split(' ');
        const labelValue = labelParts.length > 1 
          ? labelParts.map((part: string) => item[part]).join(' ')
          : item[labelKey];
        return { 
          // แปลงเป็น String เสมอเพื่อให้ตรงกับข้อมูลที่มักมาจาก Database
          value: String(item[valueKey]), 
          label: labelValue 
        };
      })}
      className="w-full" 
    />
  );

  if (initialLoading) return (
    <div className="h-screen flex flex-col justify-center items-center gap-4">
      <Spin size="large" />
      <Text>Loading movie details...</Text>
    </div>
  );

  return (
    <div className="min-h-screen">
      <style>{`
        .ant-card {
          border-radius: 12px;
          margin-bottom: 32px; /* Increased Gap between cards */
          border: ;
          box-shadow: 2px 2px 1px rgba(0,0,0,0.05);
        }
        .ant-form-item-label > label {
          font-size: 12px !important;
          font-weight: 600 !important;
          color: #4b5563 !important;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .ant-btn-primary {
          border-radius: 8px;
          height: 48px;
        }
        .dynamic-row { align-items: flex-start; margin-bottom: 12px; }
        .no-label .ant-form-item-label { visibility: hidden; height: 0; margin: 0; padding: 0; }
        .movie-form-header { margin-bottom: 24px; display: flex; align-items: center; gap: 16px; }

        .ant-btn-dashed {
          border-style: solid !important;
          border-color: #e5e7eb !important;
          color: #434343 !important;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .ant-btn-dashed:hover {
          border-color: #4096ff !important; /* เปลี่ยนเป็นสีน้ำเงินเมื่อนำเมาส์ไปชี้ */
          color: #4096ff !important;
        }
      `}</style>
      

      <Form 
        form={form} 
        layout="vertical" 
        onFinish={onFinish}
        initialValues={{ 
          media_files: [{}], 
          resources: [{}], 
          cast_and_crew: [{}],
          price: 0
        }}
      >
        <Row gutter={[32, 32]}>
            <Col span={8}>
            {/* Media/Poster Upload Card */}
            <Card title="Poster Image">
              <Form.Item name="img_path" label="Poster URL / Path">
                <Input placeholder="/img/movies/poster.jpg" />
              </Form.Item>
              
              <div className="mb-4">
                <Upload 
                  beforeUpload={() => false} // Prevents actual upload for now
                  maxCount={1}
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />} block size="large">Select File from Machine</Button>
                </Upload>
              </div>

              <div className="aspect-[2/3] bg-gray-50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
                <Text type="secondary" style={{ fontSize: '11px', textAlign: 'center', padding: '20px' }}>
                  Preview will appear here<br/>when a valid path is provided
                </Text>
              </div>
            </Card>

          </Col>
          <Col span={16}>
          {/* Basic Information Card */}
            <Card title="General Information">
              <Row gutter={24}>
                <Col span={16}>
                  <Form.Item name="title" label="Movie Title" rules={[{ required: true, message: 'Please enter movie title' }]}>
                    <Input placeholder="e.g. Inception" size="large" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="release_date" label="Release Date" rules={[{ required: true, message: 'Select release date' }]}>
                    <DatePicker className="w-full" size="large" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="movie_description" label="Synopsis / Description">
                    <TextArea rows={5} placeholder="Provide a brief summary of the movie..." />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="rating_id" label="Maturity Rating" rules={[{ required: true, message: 'Select rating' }]}>
                    <SearchableSelect options={ratings} placeholder="Select Rating" valueKey="rating_id" labelKey="rating_label" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="country_code" label="Country of Origin" rules={[{ required: true, message: 'Select country' }]}>
                    <SearchableSelect options={countries} placeholder="Select Country" valueKey="country_code" labelKey="country_name" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="price" label="Purchase Price (USD)" rules={[{ required: true, message: 'Set price' }]}>
                    <InputNumber prefix="$" className="w-full" min={0} precision={2} size="large" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
            
        </Row>
        <Row gutter={[32, 32]}>
          <Col span={24}>
            {/* Genre Card */}
            <Card title="Genres Selection">
              <Form.Item name="genres" label="Choose applicable genres" rules={[{ required: true, message: 'Select at least one genre' }]}>
                <Checkbox.Group className="w-full">
                  <Row gutter={[16, 16]}>
                    {genres.map(g => (
                      <Col span={4} key={g.genre_id}>
                        <Checkbox value={g.genre_id}>{g.genre_name}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Card>

            {/* Video Stream Qualities Section */}
            <Card title="Video Stream Qualities">
              <Form.List name="media_files">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <Row key={key} gutter={16} className="dynamic-row" style={{ alignItems: 'flex-end' }}>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, 'quality']}
                            label={index === 0 ? "Resolution" : ""}
                            rules={[{ required: true, message: 'Required' }]}
                            className={index > 0 ? "no-label" : ""}
                          >
                            <Select 
                              placeholder="Select" 
                              options={qualityOptions.map(q => ({ value: q.id, label: q.name }))} 
                            />
                          </Form.Item>
                        </Col>
                        <Col span={14}>
                          <Form.Item
                            {...restField}
                            name={[name, 'file_path']}
                            label={index === 0 ? "Stream URL / File Path" : ""}
                            rules={[{ required: true, message: 'Required' }]}
                            className={index > 0 ? "no-label" : ""}
                          >
                            <Input placeholder="e.g. /media/video_1080p.mp4" />
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <Form.Item
                            {...restField}
                            name={[name, 'priority']}
                            label={index === 0 ? "Order" : ""}
                            className={index > 0 ? "no-label" : ""}
                            initialValue={index + 1}
                          >
                            <InputNumber min={1} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                        <Col span={2} className="flex justify-center" style={{ paddingBottom: index === 0 ? '30px' : '4px' }}>
                          <Button 
                            type="text" 
                            danger 
                            icon={<DeleteOutlined />} 
                            onClick={() => remove(name)} 
                          />
                        </Col>
                      </Row>
                    ))}
                    <Button 
                      type="dashed" 
                      onClick={() => add()} 
                      block 
                      icon={<PlusOutlined />} 
                      style={{ marginTop: fields.length > 0 ? 0 : 8 }}
                    >
                      Add Stream Quality
                    </Button>
                  </>
                )}
              </Form.List>
            </Card>

            {/* Audio & Subtitle Assets Section */}
            <Card title="Audio & Subtitle Assets">
              <Form.List name="resources">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <Row key={key} gutter={16} className="dynamic-row" style={{ alignItems: 'flex-end' }}>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, 'type']}
                            label={index === 0 ? "Asset Type" : ""}
                            rules={[{ required: true, message: 'Required' }]}
                            className={index > 0 ? "no-label" : ""}
                          >
                            <Select placeholder="Type">
                              <Select.Option value="Audio">Audio</Select.Option>
                              <Select.Option value="Subtitle">Subtitle</Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, 'language_id']}
                            label={index === 0 ? "Language" : ""}
                            rules={[{ required: true, message: 'Required' }]}
                            className={index > 0 ? "no-label" : ""}
                          >
                            <SearchableSelect 
                              options={languages} 
                              placeholder="Select" 
                              valueKey="language_id" 
                              labelKey="language_name" 
                            />
                          </Form.Item>
                        </Col>
                        <Col span={10}>
                          <Form.Item
                            {...restField}
                            name={[name, 'file_path']}
                            label={index === 0 ? "Resource Path" : ""}
                            rules={[{ required: true, message: 'Required' }]}
                            className={index > 0 ? "no-label" : ""}
                          >
                            <Input placeholder="e.g. /res/audio_en.mp3" />
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <Form.Item
                            {...restField}
                            name={[name, 'priority']}
                            label={index === 0 ? "Order" : ""}
                            className={index > 0 ? "no-label" : ""}
                            initialValue={1}
                          >
                            <InputNumber min={1} style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                        <Col span={2} className="flex justify-center" style={{ paddingBottom: index === 0 ? '30px' : '4px' }}>
                          <Button 
                            type="text" 
                            danger 
                            icon={<DeleteOutlined />} 
                            onClick={() => remove(name)} 
                          />
                        </Col>
                      </Row>
                    ))}
                    <Button 
                      type="dashed" 
                      onClick={() => add()} 
                      block 
                      icon={<PlusOutlined />}
                      style={{ marginTop: fields.length > 0 ? 0 : 8 }}
                    >
                      Add Resource Asset
                    </Button>
                  </>
                )}
              </Form.List>
            </Card>

            {/* Cast and Crew Card */}
            <Card title="Cast & Crew Members">
              <Form.List name="cast_and_crew">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <Row key={key} gutter={16} className="dynamic-row" style={{ alignItems: 'flex-end' }}>
                        <Col span={9}>
                          <Form.Item 
                            {...restField} 
                            name={[name, 'person_id']} 
                            label={index === 0 ? "Full Name" : ""} 
                            className={index > 0 ? "no-label" : ""}
                          >
                            <SearchableSelect 
                              options={persons} 
                              placeholder="Search person..." 
                              valueKey="person_id" 
                              labelKey="first_name last_name" 
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item 
                            {...restField} 
                            name={[name, 'role_type']} 
                            label={index === 0 ? "Role" : ""} 
                            className={index > 0 ? "no-label" : ""}
                          >
                            <Select placeholder="Select Role" options={[
                              { value: 'Actor', label: 'Actor' },
                              { value: 'Director', label: 'Director' },
                              { value: 'Producer', label: 'Producer' },
                              { value: 'Crew', label: 'Crew Member' }
                            ]} />
                          </Form.Item>
                        </Col>
                        <Col span={7}>
                          <Form.Item 
                            {...restField} 
                            name={[name, 'character_name']} 
                            label={index === 0 ? "Character Name" : ""} 
                            className={index > 0 ? "no-label" : ""}
                          >
                            <Input placeholder="e.g. Cobb" />
                          </Form.Item>
                        </Col>
                        <Col span={2} className="flex justify-center" style={{ paddingBottom: index === 0 ? '30px' : '4px' }}>
                          <Button 
                            type="text" 
                            danger 
                            icon={<DeleteOutlined />} 
                            onClick={() => remove(name)} 
                          />
                        </Col>
                      </Row>
                    ))}
                    {/* ปรับปรุงปุ่ม: นำ size="large" ออก และใช้สไตล์ขอบเข้มจาก CSS ด้านบน */}
                    <Button 
                      type="dashed" 
                      onClick={() => add()} 
                      block 
                      icon={<PlusOutlined />}
                    >
                      Add Cast/Crew Member
                    </Button>
                  </>
                )}
              </Form.List>
            </Card>
          </Col>
        </Row>

        {/* Floating Action Bar */}
        <div className="bottom-8 p-6 flex justify-end gap-4 rounde\ roud-2xl z-10">
          <Button size="large" onClick={() => navigate('/admin/movies')} disabled={loading} style={{ padding: '0 32px' }}>
            Cancel
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large" 
            loading={loading} 
            className="max-h-10 px-16 bg-blue-600 hover:bg-blue-700 font-bold"
          >
            {id ? 'Update Content' : 'Publish Content'}
          </Button>
        </div>
      </Form>
    </div>
  );
}