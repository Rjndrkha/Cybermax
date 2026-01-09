import { Form, Input, Button, Card, Select, message, Typography } from "antd";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

const { Title } = Typography;

const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      await api.post("/auth/register", values);
      message.success("Registrasi Berhasil! Silakan Login.");
      navigate("/login");
    } catch (err: any) {
      message.error(err.response?.data?.error || "Registrasi Gagal");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-96 shadow-xl border-0">
        <div className="text-center mb-6">
          <Title level={3}>Create Account</Title>
          <p className="text-gray-400">DMS - Document Management System</p>
        </div>

        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ role: "USER" }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Masukkan email yang valid!",
              },
            ]}
          >
            <Input placeholder="email@example.com" size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                min: 6,
                message: "Password minimal 6 karakter!",
              },
            ]}
          >
            <Input.Password placeholder="******" size="large" />
          </Form.Item>

          <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Select size="large">
              <Select.Option value="USER">User (Standard)</Select.Option>
              <Select.Option value="ADMIN">Admin (Approver)</Select.Option>
            </Select>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            className="mt-2 bg-blue-600"
          >
            Register Now
          </Button>

          <div className="text-center mt-4">
            <span className="text-gray-500">Sudah punya akun? </span>
            <Link to="/login" className="text-blue-600 hover:underline">
              Login di sini
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
