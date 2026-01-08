import { Form, Input, Button, Card, message } from "antd";
import api from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const { data } = await api.post("/auth/login", values);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      message.success("Login Berhasil!");
      navigate("/dashboard");
    } catch (err: any) {
      message.error(err.response?.data?.error || "Login Gagal");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <Card title="DMS Login" className="w-96 shadow-lg">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>

          <div className="text-center mt-4">
            <span className="text-gray-500">Belum punya akun? </span>
            <Link to="/register" className="text-blue-600 hover:underline">
              Daftar sekarang
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
