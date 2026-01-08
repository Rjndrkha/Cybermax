import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import DocumentList from "../pages/DocumentList";
import AdminApprovals from "../pages/AdminApprovals";
import Dashboard from "../pages/Dashboard";
import Notifications from "../pages/Notifications";
import Register from "../pages/auth/Register";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documents" element={<DocumentList />} />
          <Route path="/notifications" element={<Notifications />} />

          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin/approvals" element={<AdminApprovals />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<div>404 - Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
