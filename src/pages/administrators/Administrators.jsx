import { Avatar, Image, message, Modal, Space, Table } from "antd";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import AddAdmin from "./AddAmin";
import AdminEdit from "./AdminEdit";
import { API, useAllUsers } from "../../api/api";
import { useState } from "react";

function Administrators() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });

  const { allUserList, isLoading, isError, error, refetch } =
    useAllUsers(filter);

  // 🗑️ delete confirm modal
  const showDeleteConfirm = (adminId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this admin?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          await API.delete(`/api/auth/user/delete/${adminId}/`);
          message.success("Admin deleted successfully!");
          refetch();
        } catch (err) {
          message.error(err.response?.data?.error || "Failed to delete admin");
        }
      },
    });
  };

  const columns = [
    {
      title: <span>Sl no.</span>,
      dataIndex: "id",
      key: "id",
      render: (_, record, index) => (
        <span>#{filter.limit * (filter.page - 1) + (index + 1)}</span>
      ),
    },
    {
      title: <span>Name</span>,
      dataIndex: "full_name",
      key: "full_name",
      render: (_, record) => (
        <div className="flex gap-2 items-center">
          <Avatar size={40} src={record?.profile_picture} />
          <h2>{record?.full_name}</h2>
        </div>
      ),
    },
    {
      title: <span>Email</span>,
      dataIndex: "email",
      key: "email",
      render: (email) => <span className="">{email}</span>,
    },
    {
      title: <span>Phone</span>,
      dataIndex: "phone_number",
      key: "phone_number",
      render: (phone_number) => <span className="">{phone_number}</span>,
    },

    {
      title: <span>Action</span>,
      key: "action",
      render: (_, record) => {
        const isSuperAdmin = record?.is_superuser === true;

        return (
          <Space size="middle">
            <AdminEdit adminProfile={record} refetch={refetch} />

            <DeleteOutlined
              className={`text-[23px] bg-[#E30000] p-1 rounded-sm text-white ${
                isSuperAdmin
                  ? "cursor-not-allowed opacity-50"
                  : "hover:text-red-300 cursor-pointer"
              }`}
              onClick={
                isSuperAdmin ? undefined : () => showDeleteConfirm(record.id)
              }
            />
          </Space>
        );
      },
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    setFilter((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  if (isLoading) {
    return <IsLoading />;
  }

  if (isError) {
    return <IsError error={error} refetch={refetch} />;
  }

  return (
    <div className="p-4">
      <AddAdmin refetch={refetch} />

      <Table
        columns={columns}
        dataSource={allUserList?.results || []}
        rowKey="id"
        pagination={{
          current: filter.page,
          pageSize: filter.limit,
          total: allUserList?.data?.count || 0,
          showSizeChanger: false,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        onChange={handleTableChange}
        loading={isLoading}
      />
    </div>
  );
}

export default Administrators;
