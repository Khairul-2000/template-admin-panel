import React, { useState } from "react";
import { EditOutlined, UserOutlined, CameraOutlined } from "@ant-design/icons";
import {
  Button,
  Modal,
  Form,
  Input,
  message,
  Select,
  Avatar,
  Upload,
  Space,
} from "antd";
// import { API } from "../../api/api";

const { Option } = Select;

const AdminEdit = ({ adminProfile, refetch }) => {
  const isSuperAdmin = adminProfile.role === "superadmin";
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

  const handleImageSelect = (file) => {
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
    };
    reader.readAsDataURL(file);

    return false;
  };

  const handleFinish = async (values) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("full_name", values.full_name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("role", values.role);

      if (imageFile) {
        formData.append("profile", imageFile);
      }

      console.log("Updating admin with data:", {
        full_name: values.full_name,
        email: values.email,
        phone: values.phone,
        role: values.role,
        hasNewImage: !!imageFile,
      });

      // await API.put(
      //   `/admin/administrators/${adminProfile.id}/update/`,
      //   formData,
      //   {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   }
      // );

      message.success("Admin updated successfully!");
      refetch();

      setSelectedImage(null);
      setImageFile(null);
      setIsModalOpen(false);
    } catch (err) {
      console.log(err, "err");
      message.error(err.response?.data?.error || "Failed to update Admin");
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
      <EditOutlined
        className={`text-[23px] my-main-button p-1 rounded-sm text-white ${
          isSuperAdmin
            ? "!cursor-not-allowed opacity-50"
            : "hover:text-blue-300 cursor-pointer"
        }`}
        onClick={isSuperAdmin ? undefined : showModal}
      />

      <Modal
        title="Update Admin Profile"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={500}
      >
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <Avatar
              size={100}
              src={selectedImage || adminProfile?.profile}
              icon={<UserOutlined />}
              className="border-2 border-gray-200"
            />

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
                className="absolute -bottom-1 -right-1 shadow-md"
                style={{ backgroundColor: "#1890ff" }}
              />
            </Upload>
          </div>

          {selectedImage && (
            <p className="text-green-600 text-sm mb-2">
              New image selected. Click "Update" to save changes.
            </p>
          )}
        </div>

        <Form
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            id: adminProfile?.id,
            full_name: adminProfile?.full_name,
            email: adminProfile?.email,
            phone: adminProfile?.phone,
            role: adminProfile?.role,
          }}
        >
          <Form.Item
            label="Name"
            name="full_name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role" }]}
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
                icon={<EditOutlined />}
              >
                Update
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdminEdit;
