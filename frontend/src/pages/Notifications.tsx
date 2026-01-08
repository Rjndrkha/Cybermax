import React, { useEffect, useState } from "react";
import { List, Avatar, Button, message, Typography, Tag } from "antd";
import {
  BellOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import * as NotifService from "../services/notification.service";

const { Title } = Typography;

const Notifications: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const res = await NotifService.getMyNotifications();
      setData(res);
    } catch (err) {
      message.error("Gagal memuat notifikasi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await NotifService.markRead(id);
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Title level={2}>Your Notifications</Title>
      <List
        loading={loading}
        itemLayout="horizontal"
        dataSource={data}
        className="bg-white rounded-lg"
        renderItem={(item: any) => (
          <List.Item
            actions={[
              !item.isRead && (
                <Button type="link" onClick={() => handleMarkRead(item.id)}>
                  Mark as Read
                </Button>
              ),
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={
                    item.title.includes("APPROVED") ? (
                      <CheckCircleOutlined />
                    ) : (
                      <BellOutlined />
                    )
                  }
                  className={
                    item.title.includes("APPROVED")
                      ? "bg-green-500"
                      : "bg-blue-500"
                  }
                />
              }
              title={
                <div className="flex items-center gap-2">
                  <span>{item.title}</span>
                  {!item.isRead && <Tag color="red">New</Tag>}
                </div>
              }
              description={
                <div>
                  <p>{item.message}</p>
                  <small className="text-gray-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </small>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Notifications;
