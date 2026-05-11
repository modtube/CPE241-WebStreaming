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
}

export default function GenericAddModal({
  title,
  open,
  onCancel,
  onSuccess,
  apiEndpoint,
  fields,
}: GenericAddModalProps) {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Save failed");

      message.success(`${title} added successfully!`);
      form.resetFields();
      onSuccess(); // สั่งให้หน้าหลักรีโหลดข้อมูลในตาราง
    } catch (error) {
      message.error("บันทึกข้อมูลไม่สำเร็จ");
    }
  };

  return (
    <Modal
      title={<span className="text-xl font-bold">{title}</span>}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Save"
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
            {f.type === "number" ? (
              <InputNumber className="w-full" />
            ) : f.type === "textarea" ? (
              <Input.TextArea rows={4} />
            ) : (
              <Input />
            )}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
}
