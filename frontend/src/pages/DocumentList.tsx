import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Modal,
  Form,
  message,
  Upload,
} from "antd";
import {
  SearchOutlined,
  UploadOutlined,
  DeleteOutlined,
  EyeOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import * as DocService from "../services/document.service";

const DocumentList: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);

  const fetchDocs = async (search = "") => {
    setLoading(true);
    try {
      const docs = await DocService.getDocuments(search);
      setData(docs);
    } catch (err: any) {
      message.error(err.error || "Gagal memuat dokumen");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleFinishUpload = async (values: any) => {
    if (fileList.length === 0)
      return message.warning("Silakan pilih file terlebih dahulu");

    const file = fileList[0].originFileObj;
    if (file.size > 5 * 1024 * 1024) {
      return message.error("Ukuran file maksimal 5MB");
    }

    const formData = new FormData();
    formData.append("file", fileList[0].originFileObj);
    formData.append("title", values.title);
    formData.append("documentType", values.documentType);
    formData.append("description", values.description || "");

    try {
      await DocService.uploadDocument(formData);
      message.success("Dokumen berhasil diunggah");
      setIsModalOpen(false);
      form.resetFields();
      setFileList([]);
      fetchDocs();
    } catch (err: any) {
      message.error(err.response.data.error || "Gagal mengunggah dokumen");
    }
  };

  const onConfirmDelete = (id: string) => {
    Modal.confirm({
      title: "Minta Izin Hapus?",
      content: "Dokumen akan dikunci sampai Admin menyetujui penghapusan.",
      okText: "Kirim Permintaan",
      okType: "danger",
      onOk: async () => {
        try {
          await DocService.requestDeleteDocument(id);
          message.success("Permintaan hapus dikirim ke Admin");
          fetchDocs();
        } catch (err: any) {
          message.error(err.error || "Gagal mengirim permintaan");
        }
      },
    });
  };

  const onConfirmReplace = (id: string) => {
    Modal.confirm({
      title: "Minta Izin Ganti Dokumen?",
      content:
        "Dokumen akan dikunci sampai Admin menyetujui penggantian file dengan versi baru.",
      okText: "Kirim Permintaan",
      onOk: async () => {
        try {
          await DocService.requestReplaceDocument(id);
          message.success("Permintaan ganti dikirim ke Admin");
          fetchDocs();
        } catch (err: any) {
          message.error(err.error || "Gagal mengirim permintaan");
        }
      },
    });
  };

  const handleOpenReplaceModal = (id: string) => {
    setSelectedDocId(id);
    setIsReplaceModalOpen(true);
  };

  const handleFinishReplace = async (values: any) => {
    if (fileList.length === 0)
      return message.warning("Silakan pilih file terlebih dahulu");

    const file = fileList[0].originFileObj;
    if (file.size > 5 * 1024 * 1024) {
      return message.error("Ukuran file maksimal 5MB");
    }

    const formData = new FormData();
    formData.append("file", fileList[0].originFileObj);

    try {
      await DocService.updateDocument(selectedDocId!, formData);
      message.success("Versi dokumen berhasil diperbarui!");
      setIsReplaceModalOpen(false);
      fetchDocs();
    } catch (err: any) {
      message.error(err.error || "Gagal memperbarui file");
    }
  };

  const columns = [
    { title: "Judul", dataIndex: "title", key: "title", width: "30%" },
    { title: "Tipe", dataIndex: "documentType", key: "documentType" },
    {
      title: "Status",
      dataIndex: "status",
      render: (st: string) => (
        <Tag color={st === "ACTIVE" ? "green" : "orange"}>{st}</Tag>
      ),
    },
    {
      title: "Aksi",
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => DocService.viewDocument(record.fileUrl)}
          />

          {record.status === "ACTIVE" && (
            <>
              <Button
                icon={<SwapOutlined />}
                title="Minta Izin Ganti"
                onClick={() => onConfirmReplace(record.id)}
              />
              <Button
                danger
                icon={<DeleteOutlined />}
                title="Minta Izin Hapus"
                onClick={() => onConfirmDelete(record.id)}
              />
            </>
          )}

          {record.status === "ACTIVE" && record.version > 1 && (
            <Button
              className="bg-orange-500 text-white"
              icon={<UploadOutlined />}
              title="Klik untuk Upload File Baru"
              onClick={() => handleOpenReplaceModal(record.id)}
            />
          )}

          {record.status.startsWith("PENDING") && (
            <Tag color="orange">Menunggu Persetujuan...</Tag>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Daftar Dokumen</h1>
        <Button
          type="primary"
          icon={<UploadOutlined />}
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600"
        >
          Upload Baru
        </Button>
      </div>

      <Input
        placeholder="Cari dokumen..."
        prefix={<SearchOutlined />}
        onChange={(e) => fetchDocs(e.target.value)}
        className="w-full max-w-sm"
      />

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        loading={loading}
        bordered
      />

      <Modal
        title="Form Upload Dokumen"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFinishUpload}>
          <Form.Item
            name="title"
            label="Judul Dokumen"
            rules={[{ required: true }]}
          >
            <Input placeholder="Contoh: Laporan Keuangan" />
          </Form.Item>
          <Form.Item
            name="documentType"
            label="Tipe File"
            initialValue="PDF"
            rules={[{ required: true, message: "Pilih tipe file" }]}
          >
            <Input value="PDF" disabled />
          </Form.Item>
          <Form.Item name="description" label="Deskripsi (Opsional)">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Pilih File" required>
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Pilih File Lokal</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Upload Versi Baru"
        open={isReplaceModalOpen}
        onCancel={() => setIsReplaceModalOpen(false)}
        onOk={() => handleFinishReplace({})}
        destroyOnClose
      >
        <div className="mb-4 text-gray-500">
          Pilih file baru untuk menggantikan versi sebelumnya. Sistem akan
          menaikkan nomor versi secara otomatis.
        </div>
        <Upload
          beforeUpload={() => false}
          fileList={fileList}
          onChange={({ fileList }) => setFileList(fileList)}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Pilih File Baru</Button>
        </Upload>
      </Modal>
    </div>
  );
};

export default DocumentList;
