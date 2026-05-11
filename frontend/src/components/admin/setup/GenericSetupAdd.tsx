import { useEffect } from "react";
import { Modal, Form, Input, InputNumber, message } from "antd";

interface FieldConfig {
  label: string;
  name: string;
  type?: "text" | "number" | "textarea";
  required?: boolean;
}

interface GenericAddModalProps {
  title: string;
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  apiEndpoint: string;
  fields: FieldConfig[];
  editData?: any; // 🟢 เพิ่ม: ข้อมูลที่จะนำมา pre-fill ตอนแก้ไข
  pkField: string; // 🟢 เพิ่ม: ชื่อฟิลด์ที่เป็น Primary Key (เช่น 'country_code')
}

export default function GenericAddModal({
  title,
  open,
  onCancel,
  onSuccess,
  apiEndpoint,
  fields,
  editData,
  pkField,
}: GenericAddModalProps) {
  const [form] = Form.useForm();
  const isEdit = !!editData; // เช็คว่าเป็นโหมดแก้ไขหรือไม่

  // 💡 เมื่อ Modal เปิด หรือ editData เปลี่ยน ให้ใส่ข้อมูลลงใน Form
  useEffect(() => {
    if (open) {
      if (editData) {
        form.setFieldsValue(editData);
      } else {
        form.resetFields();
      }
    }
  }, [open, editData, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // 💡 เลือก URL และ Method ตามโหมด (Add = POST, Edit = PUT/PATCH)
      const url = isEdit ? `${apiEndpoint}/${editData[pkField]}` : apiEndpoint;
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Save failed");

      message.success(`${title} ${isEdit ? "updated" : "added"} successfully!`);
      onSuccess();
    } catch (error) {
      message.error("บันทึกข้อมูลไม่สำเร็จ");
    }
  };

  return (
    <Modal
      title={
        <span className="text-xl font-bold">
          {isEdit ? `Edit ${title}` : `Add ${title}`}
        </span>
      }
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText={isEdit ? "Confirm Change" : "Save"}
      cancelText="Cancel"
      destroyOnClose
    >
      <Form form={form} layout="vertical" className="mt-4">
        {fields.map((f) => (
          <Form.Item
            key={f.name}
            label={f.label}
            name={f.name}
            rules={[
              { required: f.required, message: `Please enter ${f.label}` },
            ]}
          >
            {/* ถ้าเป็นโหมดแก้ไข และเป็นฟิลด์ PK (เช่น country_code) อาจจะตั้งเป็น disabled ไว้ไม่ให้แก้รหัสหลัก */}
            {f.type === "number" ? (
              <InputNumber className="w-full" />
            ) : f.type === "textarea" ? (
              <Input.TextArea rows={4} />
            ) : (
              <Input disabled={isEdit && f.name === pkField} />
            )}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
}
