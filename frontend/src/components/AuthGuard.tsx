import { Navigate, Outlet } from "react-router-dom";

export const AuthGuard = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};
