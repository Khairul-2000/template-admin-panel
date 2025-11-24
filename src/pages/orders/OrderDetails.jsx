import {
  Modal,
  Spin,
  Button,
  Tag,
  Card,
  Row,
  Col,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import IsError from "../../components/IsError";
import { useSingleOrder } from "../../api/api";
import logo from "../../assets/logo.png";

function OrderDetails({ singleData, isVisible, onClose }) {
  const { singleOrder, isLoading, isError, error, refetch } = useSingleOrder(
    { orderID: singleData?.id },
    {
      enabled: isVisible && !!singleData?.id,
    }
  );

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "orange";
      case "On Going":
        return "blue";
      case "Cancelled":
        return "red";
      case "Completed":
        return "green";
      default:
        return "default";
    }
  };

  return (
    <Modal
      width={500}
      closable={true}
      open={isVisible}
      onOk={onClose}
      onCancel={onClose}
      footer={[
        <Button
          key="close"
          onClick={onClose}
          className="bg-gray-100 hover:bg-gray-200"
        >
          Close
        </Button>,
      ]}
    >
      {/* LOADING */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      )}

      {/* ERROR */}
      {isError && <IsError error={error} refetch={refetch} />}

      {/* CONTENT */}
      {singleOrder && (
        <div className="space-y-6">
          {/* Logo */}
          <div className="w-full h-32 flex items-center justify-center ">
            <img src={logo} alt="Logo" className="h-1/2 object-contain" />
          </div>

          {/* ORDER ITEMS */}
          <Card title="Order Items" size="small" className="shadow-sm">
            <div className="space-y-4">
              {singleOrder.order_details?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">
                      {item.product_name} ({item.quantity} x)
                    </h4>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      £{item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* ORDER SUMMARY */}
          <Card title="Order Summary" size="small" className="shadow-sm">
            <Row gutter={[16, 16]} className="text-gray-700">

              <Col span={12}>
                <div className="flex justify-between py-2 border-b">
                  <span>Customer:</span>
                  <span className="font-medium">{singleOrder.customer_name}</span>
                </div>
              </Col>

              <Col span={12}>
                <div className="flex justify-between py-2 border-b">
                  <span>Phone:</span>
                  <span className="font-medium">{singleOrder.phone_number}</span>
                </div>
              </Col>

              <Col span={24}>
                <div className="flex justify-between py-2 border-b">
                  <span>Address:</span>
                  <span className="font-medium">{singleOrder.address}</span>
                </div>
              </Col>

              <Col span={12}>
                <div className="flex justify-between py-2 border-b">
                  <span>Delivery Date:</span>
                  <span className="font-medium">{singleOrder.delivery_date}</span>
                </div>
              </Col>

              <Col span={12}>
                <div className="flex justify-between py-2 border-b">
                  <span>Payment:</span>
                  <span className="font-medium">{singleOrder.payment_method}</span>
                </div>
              </Col>

              <Col span={12}>
                <div className="flex justify-between py-2 border-b">
                  <span>Payment Status:</span>
                  <Tag color={singleOrder.payment_status === "Paid" ? "green" : "red"}>
                    {singleOrder.payment_status}
                  </Tag>
                </div>
              </Col>

              <Col span={12}>
                <div className="flex justify-between py-2 border-b">
                  <span>Order Status:</span>
                  <Tag color={getStatusColor(singleOrder.status)}>
                    {singleOrder.status}
                  </Tag>
                </div>
              </Col>

              <Col span={24}>
                <div className="flex justify-between py-2 bg-blue-50 px-3 rounded mt-2">
                  <span className="font-semibold text-lg">Total Amount:</span>
                  <span className="font-bold text-lg text-blue-600">
                    £{singleOrder.total}
                  </span>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      )}
    </Modal>
  );
}

export default OrderDetails;
