import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Upload,
  Avatar,
  Space,
} from "antd";
import { UserOutlined, CameraOutlined, EditOutlined } from "@ant-design/icons";
import { FaPlus } from "react-icons/fa";
// import { API } from "../../api/api";

const { Option } = Select;

const AddAdmin = ({ refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setSelectedImage(null);
    setImageFile(null);
    setIsModalOpen(false);
  };

  // image select handler
  const handleImageSelect = (file) => {
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
    };
    reader.readAsDataURL(file);

    return false;
  };

  // image remove handler
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageFile(null);
  };

  const handleFinish = async (values) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("role", values.role);

      if (imageFile) {
        formData.append("profile", imageFile);
      }

      console.log("Creating admin with data:", {
        name: values.name,
        email: values.email,
        phone: values.phone,
        role: values.role,
        hasImage: !!imageFile,
      });

      // await API.post("/admin/administrators/create/", formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });

      message.success("Admin created successfully!");
      refetch?.();

      setSelectedImage(null);
      setImageFile(null);
      setIsModalOpen(false);
    } catch (err) {
      message.error(err.response?.data?.detail || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
      return false;
    }
    return true;
  };

  return (
    <>
      <Button
        type="primary"
        className="mb-2 my-main-button"
        onClick={showModal}
        icon={<FaPlus />}
      >
        New Administrators Profile Create
      </Button>

      <Modal
        title="Create New Admin"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={500}
      >
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-2">
            <Avatar
              size={80}
              src={selectedImage}
              icon={<UserOutlined />}
              className="border-2 border-gray-200"
            />

            <div className="absolute -bottom-2 -right-2 flex gap-1">
              {selectedImage ? (
                <Button
                  type="default"
                  shape="circle"
                  size="small"
                  danger
                  onClick={handleRemoveImage}
                  className="shadow-md"
                >
                  ×
                </Button>
              ) : (
                <Upload
                  name="avatar"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  accept="image/jpeg,image/png"
                  customRequest={({ file, onSuccess }) => {
                    onSuccess("ok");
                  }}
                  onChange={(info) => {
                    if (info.file.status === "done") {
                      handleImageSelect(info.file.originFileObj);
                    }
                  }}
                >
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<CameraOutlined />}
                    size="small"
                    className="shadow-md"
                  />
                </Upload>
              )}
            </div>
          </div>

          <p className="text-gray-500 text-sm text-center">
            {selectedImage
              ? "Profile image added (optional)"
              : "Add profile image (optional)"}
          </p>
        </div>

        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter admin name" }]}
          >
            <Input placeholder="Enter admin name" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter admin email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter admin email" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="+880..." />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select role" }]}
          >
            <Select placeholder="Select role">
              <Option value="admin">Admin</Option>
              <Option value="superadmin">Super Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                type="primary"
                className="my-main-button"
                htmlType="submit"
                loading={loading}
                icon={<FaPlus />}
              >
                Create Admin
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddAdmin;
