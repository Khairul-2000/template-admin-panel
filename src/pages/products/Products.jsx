import {
  Avatar,
  Image,
  message,
  Modal,
  Space,
  Table,
  Input,
  Button,
} from "antd";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { API, useAllProducts } from "../../api/api";
import { useState } from "react";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import { Switch } from 'antd';

function Products() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const [searchInput, setSearchInput] = useState("");

  const { allProducts, isLoading, isError, error, refetch } =
    useAllProducts(filter);



  const handleToggleBestOffer = async (product) => {
    const formData = new FormData();
    formData.append("is_best_offer", !product.is_best_offer);

    const response = await API.patch(
      `/api/shop/products/${product.id}/`,
      formData
    );

    console.log("Best Offer Toggle Response:", response.data);
  }

  const handleToggleBestSeller = async (product) => {
    const formData = new FormData();
    formData.append("is_best_seller", !product.is_best_seller);

    const response = await API.patch(
      `/api/shop/products/${product.id}/`,
      formData
    );

    console.log("Best Seller Toggle Response:", response.data);
  }

  const handleSearch = () => {
    setFilter((prev) => ({
      ...prev,
      search: searchInput,
      page: 1,
    }));
  };

  // 🗑️ delete confirm modal
  const showDeleteConfirm = (productId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          await API.delete(`/api/shop/products/${productId}/`);
          message.success("Product deleted successfully!");
          refetch();
        } catch (err) {
          console.log(err, "error");
          message.error(
            err.response?.data?.error || "Failed to delete product"
          );
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
      title: <span>Product</span>,
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div className="flex gap-2 items-center">
          <Image
            width={40}
            height={40}
            src={record?.image}
            alt={record?.name}
            style={{ objectFit: "cover", borderRadius: "4px" }}
          />
          <h2>{record?.name}</h2>
        </div>
      ),
    },
    {
      title: <span>Description</span>,
      dataIndex: "description",
      key: "description",
      render: (description) => <span>{description || "N/A"}</span>,
    },

    {
      title: <span>Best Offer</span>,
      dataIndex: "is_best_offer",
      key: "is_best_offer",
      render: (_, record) => (
        <Switch
          defaultChecked={record.is_best_offer}
          onChange={() => handleToggleBestOffer(record)}
          disabled={!record.is_active}
         
        />
      ),
    },
    {
      title: <span>Best Seller</span>,
      dataIndex: "is_best_seller",
      key: "is_best_seller",
      render: (_, record) => (
        <Switch
          defaultChecked={record.is_best_seller}
          onChange={() => handleToggleBestSeller(record)}
          disabled={!record.is_active}
          
        />
      ),
    },
    {
      title: <span>Price</span>,
      dataIndex: "price",
      key: "price",
      render: (price) => <span className="font-semibold">£{price}</span>,
    },
    {
      title: <span>Stock</span>,
      dataIndex: "stock",
      key: "stock",
      render: (stock) => (
        <span className={stock > 0 ? "text-green-600" : "text-red-600"}>
          {stock} {stock > 0 ? "available" : "out of stock"}
        </span>
      ),
    },
    {
      title: <span>UOM</span>,
      dataIndex: "uom",
      key: "uom",
      render: (uom) => <span className="uppercase">{uom}</span>,
    },
    {
      title: <span>Status</span>,
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active) => (
        <span className={is_active ? "text-green-600" : "text-gray-400"}>
          {is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: <span>Action</span>,
      key: "action",
      render: (_, record) => {
        return (
          <Space size="middle">
            <EditProduct product={record} refetch={refetch} />

            <DeleteOutlined
              className="text-[23px] bg-[#E30000] p-1 rounded-sm text-white hover:bg-red-600 cursor-pointer"
              onClick={() => showDeleteConfirm(record.id)}
            />
          </Space>
        );
      },
    },
  ];

  const handleTableChange = (pagination) => {
    setFilter((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError error={error} refetch={refetch} />;

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4 ">
        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <Input
            size="large"
            placeholder="Search products by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onPressEnter={handleSearch}
            allowClear
            style={{ width: 300 }}
            suffix={
              <SearchOutlined
                onClick={handleSearch}
                className="cursor-pointer"
              />
            }
          />
        </div>
        <AddProduct refetch={refetch} />
      </div>

      <Table
        columns={columns}
        dataSource={allProducts?.results || []}
        rowKey="id"
        pagination={{
          current: filter.page,
          pageSize: filter.limit,
          total: allProducts?.count || 0,
          showSizeChanger: false,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        onChange={handleTableChange}
        loading={isLoading}
      />
    </div>
  );
}

export default Products;