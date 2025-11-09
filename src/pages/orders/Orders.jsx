import React, { useState } from "react";
import { Table, Tag, Button, Modal, Select, message, Input, InputNumber } from "antd";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import { EditOutlined } from "@ant-design/icons";
import { useAllMockFoodOrders } from "../../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import OrderDetails from "./OrderDetails";
import logo from "../../assets/logo.png"

function ProductOrders() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const currentFilter = queryParams.get("filter") || "All";

  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });

  // Driver assignment modal states
  const [isDriverAssignModalOpen, setIsDriverAssignModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Paid Status change modal states
  const [isPaidStatusModalOpen, setIsPaidStatusModalOpen] = useState(false);
  const [selectedPaidStatus, setSelectedPaidStatus] = useState(null);
  const [newPaidStatus, setNewPaidStatus] = useState("");
  const [isPaidStatusChangeLoading, setIsPaidStatusChangeLoading] =
    useState(false);

  // Status change modal states
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [isStatusChangeLoading, setIsStatusChangeLoading] = useState(false);

  // Edit order modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedForEdit, setSelectedForEdit] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editDeliveryAddress, setEditDeliveryAddress] = useState("");
  const [editEstimatedDeliveryDate, setEditEstimatedDeliveryDate] = useState("");
  const [editDeliveryFee, setEditDeliveryFee] = useState(0);
  const [editItems, setEditItems] = useState([]);
  const [isEditLoading, setIsEditLoading] = useState(false);

  const {
    allMockFoodOrders,
    pagination = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useAllMockFoodOrders(filter);


  console.log("allMockFoodOrdersallMockFoodOrders", allMockFoodOrders);

  // Driver assignment modal
  const openDriverAssignModal = (record) => {
    setSelectedDriver(record.driver); // Set existing driver if any
    setIsDriverAssignModalOpen(true);
  };

  const handleDriverAssignChange = async () => {
    if (!selectedDriver) return;

    try {
      message.success("Driver assigned successfully!");

      console.log("selectedDriverselectedDriver", selectedDriver);

      setIsDriverAssignModalOpen(false);
      refetch();
    } catch (err) {
      message.error("Failed to assign driver");
    }
  };

  // paid status model
  const openPaidStatusModal = (record) => {
    setSelectedPaidStatus(record);
    setNewPaidStatus(record.status); // default current status
    setIsPaidStatusModalOpen(true);
  };

  const handlePaidStatusChange = async () => {
    if (!selectedPaidStatus) return;

    setIsPaidStatusChangeLoading(true);

    try {
      message.success("User paid status updated successfully!");
      setIsPaidStatusModalOpen(false);
      setSelectedPaidStatus(null);
      setNewPaidStatus("");
      refetch();
    } catch (err) {
      message.error(
        err.response?.data?.error || "Failed to update User paid status"
      );
    } finally {
      setIsPaidStatusChangeLoading(false);
    }
  };

  // status change modal
  const openStatusModal = (record) => {
    setSelectedStatus(record);
    setNewStatus(record.status); // default current status
    setIsStatusModalOpen(true);
  };

  // edit modal
  const openEditModal = (record) => {
    setSelectedForEdit(record);
    setName(record?.user?.name || "");
    setEmail(record?.user?.email || "");
    setPhone(record?.user?.phone || "");
    setEditDeliveryAddress(record?.delivery_address || "");
    setEditEstimatedDeliveryDate(record?.estimated_delivery_date || "");
    setEditDeliveryFee(record?.delivery_fee || 0);
    setEditItems(record?.items ? [...record.items] : []);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedForEdit) return;

    setIsEditLoading(true);
    try {
      // TODO: call API to update order with the edited data
      const updatedOrder = {
        ...selectedForEdit,
        contact_number: editContactNumber,
        delivery_address: editDeliveryAddress,
        estimated_delivery_date: editEstimatedDeliveryDate,
        delivery_fee: editDeliveryFee,
        items: editItems,
        // Recalculate totals
        total_quantity: editItems.reduce((sum, item) => sum + item.quantity, 0),
        total_price: editItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + editDeliveryFee,
      };

      console.log("Updated order data:", updatedOrder);

      message.success("Order updated successfully!");
      setIsEditModalOpen(false);
      setSelectedForEdit(null);
      setEditContactNumber("");
      setEditDeliveryAddress("");
      setEditDeliveryFee(0);
      setEditItems([]);
      refetch();
    } catch (err) {
      message.error("Failed to update order");
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleItemQuantityChange = (itemId, newQuantity) => {
    setEditItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleItemPriceChange = (itemId, newPrice) => {
    setEditItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, price: newPrice } : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setEditItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleStatusChange = async () => {
    if (!selectedStatus) return;

    setIsStatusChangeLoading(true);

    try {
      message.success("User status updated successfully!");
      setIsStatusModalOpen(false);
      setSelectedStatus(null);
      setNewStatus("");
      refetch();
    } catch (err) {
      message.error(
        err.response?.data?.error || "Failed to update User status"
      );
    } finally {
      setIsStatusChangeLoading(false);
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setFilter((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  const handleFilterChange = (type) => {
    if (type === "All") {
      navigate("/food-orders");
    } else {
      navigate(`/food-orders?filter=${type}`);
    }
  };

  const columns = [
    {
      title: <span>Sl no.</span>,
      dataIndex: "serial_number",
      key: "serial_number",
      render: (_, record, index) => <span>#{index + 1}</span>,
    },
    {
      title: <span>User</span>,
      dataIndex: "user",
      key: "user",
      render: (_, record) => (
        <div className="flex flex-items-center gap-2">
         
          <div className="">
            <h1 className="">{record.user.name}</h1>
            <p className="text-sm text-gray-600 mt-[-5px]">
              {record.user.email}
            </p>
          </div>
        </div>
      ),
    },

    {
      title: <span>Phone</span>,
      dataIndex: "contact_number",
      key: "contact_number",
      render: (contact_number) => <span>{contact_number}</span>,
    },
    {
      title: <span>Delivery Address</span>,
      dataIndex: "delivery_address",
      key: "delivery_address",
      render: (delivery_address) => <span>{delivery_address}</span>,
    },
     {
      title: <span>Estimated Delivery Date</span>,
      dataIndex: "estimated_delivery_date",
      key: "estimated_delivery_date",
      render: (estimated_delivery_date) => <span>{estimated_delivery_date}</span>,
    },
    {
      title: <span>Amount</span>,
      dataIndex: "total_price",
      key: "total_price",
      render: (total_price) => <span>£{total_price.toFixed(2)}</span>,
    },

    {
      title: <span>Status</span>,
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <div className="flex items-center">
          <Tag
            className="p-0.5 px-3"
            color={
              status === "Delivered"
                ? "green"
                : status === "On Going"
                  ? "blue"
                  : "orange"
            }
          >
            {status}
          </Tag>

          {status === "Delivered" ? (
            ""
          ) : (
            <Button
              className="-ml-1"
              title="Status Change"
              size="small"
              icon={<EditOutlined />}
              onClick={() => openStatusModal(record)}
            />
          )}
        </div>
      ),
    },

    {
      title: <span>Details</span>,
      key: "Details",
      render: (_, record) => <OrderDetails record={record} refetch={refetch} />,
    },


    {
      title: <span>Action</span>,
      key: "action",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            title="Edit Order"
          />
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <IsLoading />;
  }

  if (isError) {
    return <IsError error={error} refetch={refetch} />;
  }

  return (
    <div className="p-4">
      <Table
        columns={columns}
        dataSource={allMockFoodOrders}
        rowKey="_id"
        pagination={{
          current: filter.page,
          pageSize: filter.limit,
          total: pagination.totalPayments || 0,
          showSizeChanger: false,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        onChange={handleTableChange}
        loading={isLoading}
      />

      {/* status change */}
      <Modal
        title="Change Status"
        open={isStatusModalOpen}
        onOk={handleStatusChange}
        onCancel={() => setIsStatusModalOpen(false)}
        okText="Update"
        confirmLoading={isStatusChangeLoading}
      >
        <p>Select new status for this order:</p>
        <Select
          value={newStatus}
          onChange={(value) => setNewStatus(value)}
          style={{ width: "100%" }}
        >
          <Select.Option value="Pending">Pending</Select.Option>
          <Select.Option value="Delivered">Delivered</Select.Option>
          <Select.Option value="Cancelled">Cancelled</Select.Option>
        </Select>
      </Modal>

      {/* Edit order modal */}
      <Modal

        open={isEditModalOpen}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalOpen(false)}
        okText="Save Changes"
        cancelText="Cancel"
        confirmLoading={isEditLoading}
        width={600}
      >
        <div className="space-y-4">

          <div className="flex flex-col justify-center items-center  gap-4  p-4">
            <img src={logo} alt="logo" className="h-[30px] object-contain" />
            <h1 className="font-bold text-4xl">Order Details</h1>
          </div>


          <div className=" p-4">
            {/* Contact Information */}
            <div>
              <h1 className="text-2xl font-bold">Customer Information</h1>
            </div>
            <div className="flex flex-row items-center justify-center gap-3 mb-3">
              <label className="block mb-1 font-medium w-1/2">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                className="w-1/2 border-none"
              />
            </div>


            {/* Email */}
            <div className="flex flex-row items-center justify-center gap-3 mb-3">
              <label className="block mb-1 font-medium w-1/2">Email</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-1/2 border-none"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-row items-center justify-center gap-3 mb-3">
              <label className="block mb-1 font-medium w-1/2">Phone</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="w-1/2 border-none"
              />
            </div>

            {/* Order Address */}
            <div className="flex flex-row items-center justify-center gap-3 mb-3">
              <label className="block mb-1 font-medium w-1/2">Order Address</label>
              <Input
                value={editDeliveryAddress}
                onChange={(e) => setEditDeliveryAddress(e.target.value)}
                placeholder="Enter order address"

                className="w-1/2 border-none"
              />
            </div>
          </div>

          {/* Order Details */}
          <div className="">

            <div>
              <h1 className="text-2xl font-bold">Order Details</h1>
            </div>

            {/* Order Items */}
            <div>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {editItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                    </div>
                    <div className="flex items-center  gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Qty</label>
                        <InputNumber
                          min={1}
                          value={item.quantity}
                          onChange={(value) => handleItemQuantityChange(item.id, value)}
                          style={{ width: "70px" }}
                        />
                      </div>
                      <div className="">
                        <label className="block text-xs text-gray-600 mb-1">Price</label>
                        <p>£{item.price.toFixed(2)}</p>
                        {/* <InputNumber
                          min={0}
                          step={0.01}
                          value={item.price}
                          onChange={(value) => handleItemPriceChange(item.id, value)}
                          prefix="£"
                          style={{ width: "100px" }}
                        /> */}
                      </div>
                      <div className="pt-5">
                        <Button
                          danger
                          size="small"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={editItems.length <= 1}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Fee */}
            <div>
              <label className="block mb-1 font-medium">Delivery Fee</label>
              <InputNumber
                min={0}
                step={0.01}
                value={editDeliveryFee}
                onChange={(value) => setEditDeliveryFee(value)}
                prefix="£"
                style={{ width: "100%" }}
              />
            </div>

            {/* Order Summary */}
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Total Items:</span>
                <span className="font-medium">
                  {editItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Subtotal:</span>
                <span className="font-medium">
                  £{editItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Delivery Fee:</span>
                <span className="font-medium">£{editDeliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total:</span>
                <span className="text-blue-600">
                  £{(editItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + editDeliveryFee).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ProductOrders;
