import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tag, message, Card, Typography } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import * as AdminService from "../services/admin.service";
import * as DocService from "../services/document.service";

const { Title } = Typography;

const AdminApprovals: React.FC = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getPendingRequests();
      setRequests(data);
    } catch (err: any) {
      message.error(err.error || "Gagal memuat permintaan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (
    requestId: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      await AdminService.processPermissionRequest(requestId, status);
      message.success(`Permintaan berhasil di-${status.toLowerCase()}`);
      fetchRequests();
    } catch (err: any) {
      message.error(err.error || "Gagal memproses aksi");
    }
  };

  const columns = [
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      render: (id: string) => <span className="font-mono text-xs">{id}</span>,
    },
    {
      title: "Action Type",
      dataIndex: "action",
      key: "action",
      render: (action: string) => (
        <Tag color={action === "DELETE" ? "red" : "blue"}>{action}</Tag>
      ),
    },
    {
      title: "Document ID",
      dataIndex: "docId",
      key: "docId",
      render: (id: string, document: any) => (
        <Space>
          <FileTextOutlined className="text-gray-400" />

          <button
            type="button"
            onClick={() => DocService.viewDocument(document.document.fileUrl)}
            className="text-xs underline text-blue-600 hover:text-blue-800 cursor-pointer bg-transparent border-0 p-0"
            style={{ background: "none" }}
          >
            {id}
          </button>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: () => <Tag color="processing">PENDING</Tag>,
    },
    {
      title: "Keputusan",
      key: "decision",
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            className="bg-green-600 hover:bg-green-500"
            onClick={() => handleAction(record.id, "APPROVED")}
          >
            Approve
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => handleAction(record.id, "REJECTED")}
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-0 bg-gray-50">
        <Title level={3}>Admin Approval Workflow</Title>
        <p className="text-gray-500">
          Tinjau permintaan perubahan atau penghapusan dokumen dari pengguna.
        </p>
      </Card>

      <Table
        dataSource={requests}
        columns={columns}
        rowKey="id"
        loading={loading}
        locale={{ emptyText: "Tidak ada permintaan persetujuan saat ini" }}
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
};

export default AdminApprovals;
