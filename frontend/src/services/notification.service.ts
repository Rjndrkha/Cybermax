import api from "../api/axios";

export const getMyNotifications = async () => {
  try {
    const res = await api.get("/notifications");
    return res.data;
  } catch (err: any) {
    throw err.response?.data;
  }
};

export const markRead = async (id: string) => {
  await api.patch(`/notifications/${id}/read`);
};
