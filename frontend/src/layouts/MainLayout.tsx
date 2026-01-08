import React from "react";
import { Layout, Menu, Button, theme } from "antd";
import {
  FileOutlined,
  DashboardOutlined,
  BellOutlined,
  LogoutOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useNavigate, Link, Outlet } from "react-router-dom";

const { Header, Content, Sider } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="p-4 text-white font-bold text-xl">DMS Platform</div>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<FileOutlined />}>
            <Link to="/documents">Documents</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<BellOutlined />}>
            <Link to="/notifications">Notifications</Link>
          </Menu.Item>
          {user.role === "ADMIN" && (
            <Menu.Item
              key="4"
              icon={<LockOutlined />}
              className="bg-red-900/30"
            >
              <Link to="/admin/approvals">Approvals</Link>
            </Menu.Item>
          )}
        </Menu>
      </Sider>
      <Layout>
        <Header className="bg-white flex justify-between items-center px-6">
          <span className="font-semibold text-gray-600">
            Welcome, {user.email}
          </span>
          <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Button>
        </Header>
        <Content className="m-4 p-6 bg-white rounded-lg shadow">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
