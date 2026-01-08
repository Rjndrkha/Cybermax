import api from "../api/axios";

const BASE_URL = "http://localhost:3001";

export const getFileUrl = (path: string) => {
  return `${BASE_URL}${path}`;
};

export const viewDocument = (path: string) => {
  const url = getFileUrl(path);
  window.open(url, "_blank");
};

export const getDocuments = async (search: string = "", page: number = 1) => {
  const response = await api.get(`/documents`, {
    params: { search, page },
  });
  return response.data;
};

export const uploadDocument = async (formData: FormData) => {
  const response = await api.post("/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const requestDeleteDocument = async (id: string) => {
  const response = await api.post(`/documents/${id}/request-delete`);
  return response.data;
};

export const requestReplaceDocument = async (id: string) => {
  try {
    const response = await api.post(`/documents/${id}/request-replace`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: "Gagal mengirim permintaan ganti" };
  }
};

export const updateDocument = async (id: string, formData: FormData) => {
  try {
    const response = await api.patch(`/documents/${id}/update-file`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: "Gagal memperbarui file" };
  }
};
