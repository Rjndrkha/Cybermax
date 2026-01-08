import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Typography } from "antd";
import {
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import * as DocService from "../services/document.service";

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0 });

  useEffect(() => {
    const getStats = async () => {
      try {
        const docs = await DocService.getDocuments();
        setStats({
          total: docs.length,
          active: docs.filter((d: any) => d.status === "ACTIVE").length,
          pending: docs.filter((d: any) => d.status.startsWith("PENDING"))
            .length,
        });
      } catch (err) {
        console.error(err);
      }
    };
    getStats();
  }, []);

  return (
    <div className="space-y-6">
      <Title level={2}>Dashboard Summary</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            className="shadow-sm border-l-4 border-blue-500"
          >
            <Statistic
              title="Total Documents"
              value={stats.total}
              prefix={<FileTextOutlined className="mr-2 text-blue-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            className="shadow-sm border-l-4 border-green-500"
          >
            <Statistic
              title="Active Documents"
              value={stats.active}
              prefix={<CheckCircleOutlined className="mr-2 text-green-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            className="shadow-sm border-l-4 border-orange-500"
          >
            <Statistic
              title="Pending Approval"
              value={stats.pending}
              prefix={<ClockCircleOutlined className="mr-2 text-orange-500" />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
