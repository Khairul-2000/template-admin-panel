import React, { useState } from "react";
import {
  DeleteFilled,
  EditOutlined,
  EyeOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Modal,
  Tag,
  Divider,
  Descriptions,
  Image,
  Avatar,
  Card,
  Row,
  Col,
} from "antd";

import logo from "../../assets/logo.png"

const OrderDetails = ({ record, refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "orange";
      case "On Going":
        return "blue";
      case "Cancelled":
        return "red";
      case "Delivered":
        return "green";
      default:
        return "default";
    }
  };

  // Paid status color mapping
  const getPaidStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "green";
      case "Online Pay":
        return "blue";
      case "COD":
        return "red";
      default:
        return "default";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <EyeOutlined
        onClick={showModal}
        className="text-blue-500 hover:text-blue-700 text-[25px] cursor-pointer transition-colors duration-200"
        title="View Details"
      />

      <Modal
        
        
        width={500}
        closable={true}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            key="close"
            onClick={handleCancel}
            className="bg-gray-100 hover:bg-gray-200"
          >
            Close
          </Button>,
        ]}
      >
        {record && (
          <div className="space-y-6">
            {/* Logo */}
            <div className="w-full h-32 flex items-center justify-center ">
              <img src={logo} alt="Logo" className="h-1/2 object-contain" />
            </div>
     
            {/* Order Items */}
            <Card title="Order Items" size="small" className="shadow-sm">
              <div className="space-y-4">
                {record.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {item.name} ({item.quantity} x)
                      </h4>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        ${item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Order Summary */}
            <Card title="Order Summary" size="small" className="shadow-sm">
              <Row gutter={[16, 16]} className="text-gray-700">
                <Col span={12}>
                  <div className="flex justify-between py-2 border-b">
                    <span>Total Quantity:</span>
                    <span className="font-medium">
                      {record.total_quantity} items
                    </span>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex justify-between py-2 border-b">
                    <span>Delivery Fee:</span>
                    <span className="font-medium">${record?.delivery_fee}</span>
                  </div>
                </Col>

                <Col span={12}>
                  <div className="flex justify-between py-2 border-b">
                    <span>Order Status:</span>
                    <Tag color={getStatusColor(record.status)}>
                      {record.status}
                    </Tag>
                  </div>
                </Col>

                <Col span={24}>
                  <div className="flex justify-between py-2 bg-blue-50 px-3 rounded mt-2">
                    <span className="font-semibold text-lg">Total Amount:</span>
                    <span className="font-bold text-lg text-blue-600">
                      ${record.total_price}
                    </span>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        )}
      </Modal>
    </>
  );
};

export default OrderDetails;
