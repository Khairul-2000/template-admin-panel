import React, { useState } from "react";
import { Modal, Form, Input, InputNumber, Switch, Upload, Button, message, Select } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { API, useSellers } from "../../api/api";

function AddProduct({ refetch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);


  const { allSellers } = useSellers()

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setFileList([]);
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    console.log("Form Values:", values);
    console.log("Image File:", fileList[0]?.originFileObj);

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("price", values.price);
      formData.append("stock", values.stock);
      formData.append("uom", values.uom);
      formData.append("seller", values.seller)
      formData.append("is_active", values.is_active ? true : false);

      if (fileList[0]?.originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      // Console log all form data
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await API.post("/api/shop/products/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("API Response:", response.data);

      message.success("Product added successfully!");
      refetch?.();
      handleCancel();
    } catch (err) {
      console.error("Error:", err);
      message.error(err.response?.data?.error || "Failed to add product");
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


  console.log("allSellers", allSellers)

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={showModal}
        size="large"
        className="my-main-button"
      >
        Add Product
      </Button>

      <Modal
        title="Add New Product"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            is_active: true,
            stock: 0,
            uom: "pcs",
          }}
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



          <Form.Item
            label="Seller"
            name="seller"
            rules={[{ required: true, message: "Please enter Seller" }]}
          >
            <Select
              placeholder="Select a seller"
              options={
                allSellers?.map((seller) => ({
                  value: seller.id,
                  label: seller.title,
                }))
              }
            />



          </Form.Item>




          <Form.Item label="Product Image">
            <Upload {...uploadProps} listType="picture">
              <Button icon={<UploadOutlined />}>Select Image</Button>
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
                Add Product
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddProduct;