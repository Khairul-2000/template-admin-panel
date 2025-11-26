import { Menu } from "antd";
import { AppstoreOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { MdOutlineAdminPanelSettings, MdOutlinePostAdd } from "react-icons/md";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { MdSell } from "react-icons/md";

import orderIcon from "../assets/order.png";

import { RiUserCommunityFill } from "react-icons/ri";

// import { signOutAdmin, useAdminDashboard } from "../api/api";

const { SubMenu } = Menu;

const Sidebar = ({ onClick }) => {
  const location = useLocation();

  // const { adminDashboard, isLoading, isError, error, refetch } =
  //   useAdminDashboard();

  const navigate = useNavigate();
  const handleSignOut = () => {
    // signOutAdmin();
    navigate("/login");
  };

  // Determine the selected key based on current route
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === "/") return ["1"];
    // if (path === "/user-management") return ["user-management"];
    if (path === "/administrators") return ["3"];
    if (path === "/orders") return ["orders"];
    if (path === "/products") return ["products"];
    if (path === "/settings") return ["settings"];

    return ["1"];
  };

  const isSuperAdmin = "superadmin";

  const sidebarItems = [
    {
      key: "1",
      icon: <AppstoreOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },

    // {
    //   key: "user-management",
    //   icon: <FaUsers />,
    //   label: <Link to="/user-management">User Management</Link>,
    // },

    ...(isSuperAdmin
      ? [
          {
            key: "3",
            icon: <MdOutlineAdminPanelSettings className="!text-xl" />,
            label: <Link to="/administrators">Administrators</Link>,
          },
        ]
      : []),

    {
      key: "orders",
      icon: <MdOutlineProductionQuantityLimits className="!text-xl" />,
      label: <Link to="/orders">Orders</Link>,
    },
    {
      key: "products",
      icon: <img src={orderIcon} alt="Orders" className="w-6" />,
      label: <Link to="/products">Products</Link>,
    },
    
    {
      key: "sellers",
      icon: <MdSell className="!text-xl" />,
      label: <Link to="/sellers">Sellers</Link>,
    },

    {
      key: "settings",
      icon: <MdOutlinePostAdd className="!text-xl" />,
      label: <Link to="/settings">Settings</Link>,
    },



    // Add logout as a menu item at the bottom
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      className: "bottom-20",
      onClick: handleSignOut,
      style: {
        position: "absolute",
        width: "100%",
      },
      danger: true,
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={getSelectedKey()}
        items={sidebarItems}
        onClick={onClick}
        style={{
          height: "calc(100% - 64px)",
          backgroundColor: "#ffffff",
          color: "#002436",
        }}
        // theme="dark"
      />
    </div>
  );
};

export default Sidebar;
