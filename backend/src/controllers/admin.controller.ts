import { Request, Response } from "express";
import * as AdminService from "../services/admin.service.js";

export const getRequests = async (req: Request, res: Response) => {
  try {
    const data = await AdminService.getPendingRequests();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const handleAction = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!requestId) {
      return res.status(400).json({ error: "ID request wajib diisi!" });
    }

    if (status !== "APPROVED" && status !== "REJECTED") {
      return res.status(400).json({ error: "Status tidak valid!" });
    }

    const result = await AdminService.processRequest(requestId, status);
    res.json({ message: `Request berhasil di-${status}`, data: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
