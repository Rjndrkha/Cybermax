import api from "../api/axios";

export const getPendingRequests = async () => {
  const response = await api.get("/admin/requests");
  return response.data;
};

export const processPermissionRequest = async (
  requestId: string,
  status: "APPROVED" | "REJECTED"
) => {
  const response = await api.patch(`/admin/requests/${requestId}`, { status });
  return response.data;
};
