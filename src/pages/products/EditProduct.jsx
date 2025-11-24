import React, { useState } from "react";
import { Modal, Form, Input, InputNumber, Switch, Upload, Button, message, Select } from "antd";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import { API } from "../../api/api";

function EditProduct({ product, refetch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const showModal = () => {
    setIsModalOpen(true);
    // Set initial form values
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      stock: product.stock,
      uom: product.uom,
      is_active: product.is_active,
    });

    // Set existing image if available
    if (product.image) {
      setFileList([
        {
          uid: "-1",
          name: "current-image",
          status: "done",
          url: product.image,
        },
      ]);
    }

    console.log("Editing Product:", product);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setFileList([]);
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    console.log("Updated Form Values:", values);
    console.log("Product ID:", product.id);
    console.log("New Image File:", fileList[0]?.originFileObj);

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("price", values.price);
      formData.append("stock", values.stock);
      formData.append("uom", values.uom);
      formData.append("is_active", values.is_active ? true : false);

      // Only append new image if a new file is uploaded
      if (fileList[0]?.originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      // Console log all form data
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await API.patch(
        `/api/shop/products/${product.id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API Response:", response.data);

      message.success("Product updated successfully!");
      refetch?.();
      handleCancel();
    } catch (err) {
      console.error("Error:", err);
      message.error(err.response?.data?.error || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return false;
      }
      setFileList([file]);
      return false;
    },
    fileList,
    onRemove: () => {
      setFileList([]);
    },
    maxCount: 1,
  };

  return (
    <>
      <EditOutlined
        className="text-[23px] bg-blue-500 p-1 rounded-sm text-white hover:bg-blue-600 cursor-pointer"
        onClick={showModal}
      />

      <Modal
        title="Edit Product"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Product Name"
            name="name"
            rules={[
              { required: true, message: "Please enter product name" },
            ]}
          >
            <Input placeholder="Enter product name" size="large" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea
              placeholder="Enter product description"
              rows={3}
              size="large"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Price (£)"
              name="price"
              rules={[{ required: true, message: "Please enter price" }]}
            >
              <InputNumber
                placeholder="0.00"
                min={0}
                step={0.01}
                style={{ width: "100%" }}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Stock"
              name="stock"
              rules={[{ required: true, message: "Please enter stock" }]}
            >
              <InputNumber
                placeholder="0"
                min={0}
                style={{ width: "100%" }}
                size="large"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Unit of Measurement"
              name="uom"
              rules={[{ required: true, message: "Please enter UOM" }]}
            >
               <Select
    placeholder="Select a uom"
    options={[
      {
        value: 'pcs',
        label: 'Pcs',
      },
      {
        value: 'kg',
        label: 'KG',
      },
      {
        value: 'litre',
        label: 'Litre',
      },
      {
        value: "box",
        label: "Box"
      },
      {
        value: "pack",
        label: "Pack"
      }
    ]}
  />



            </Form.Item>

            <Form.Item label="Status" name="is_active" valuePropName="checked">
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          </div>

          <Form.Item label="Product Image">
            <Upload {...uploadProps} listType="picture">
              <Button icon={<UploadOutlined />}>Change Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <div className="flex gap-3 justify-end">
              <Button onClick={handleCancel} size="large">
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
              >
                Update Product
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default EditProduct;